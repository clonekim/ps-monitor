package main

import (
	"embed"
	"errors"
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/nxadm/tail"
	"github.com/shirou/gopsutil/v3/net"
	"github.com/shirou/gopsutil/v3/process"
	"html/template"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type Proc struct {
	Name          string
	Id            int32
	Ppid          int32
	Owner         string
	Cmdline       string
	Environment   []string
	Status        []string
	Terminal      string
	OpenFilesStat []process.OpenFilesStat
	CreateTime    string
	Children      []Proc
	Connection    []net.ConnectionStat
}

func Time2String(value int64) string {
	loc, _ := time.LoadLocation("Asia/Seoul")
	v := time.UnixMilli(value)
	v = v.In(loc)
	return v.Format("2006-01-02 15:04:05")
}

func CreateProc(p *process.Process) Proc {
	name, _ := p.Name()
	username, _ := p.Username()
	cmdline, _ := p.Cmdline()
	envs, _ := p.Environ()
	status, _ := p.Status()
	openfiles, _ := p.OpenFiles()
	createtime, _ := p.CreateTime()
	connections, _ := p.Connections()
	terminal, _ := p.Terminal()

	ppid, _ := p.Ppid()

	return Proc{
		Name:    name,
		Id:      p.Pid,
		Ppid:    ppid,
		Owner:   username,
		Cmdline: cmdline,
		Environment: func() []string {
			strs := make([]string, 0)
			for _, s := range envs {
				if s != "" {
					strs = append(strs, s)
				}
			}
			return strs
		}(),
		Status:        status,
		Terminal:      terminal,
		OpenFilesStat: openfiles,
		CreateTime:    Time2String(createtime),

		Connection: connections,
		Children: func() []Proc {
			var children []Proc

			pp, _ := p.Children()
			for _, v := range pp {
				children = append(children, CreateProc(v))
			}
			return children
		}(),
	}

}

func FindProcess(names []string) []Proc {

	v, _ := process.Processes()

	var response []Proc

	for _, p := range v {
		name, _ := p.Name()
		for _, q := range names {
			if strings.Contains(name, q) && strings.HasPrefix(name, q) {
				response = append(response, CreateProc(p))
			}
		}
	}

	return response
}

func GetLastLines(filepath string, size int64) ([]string, error) {

	stat, err := os.Stat(filepath)

	if errors.Is(err, os.ErrNotExist) {
		return nil, err
	}

	seek := tail.SeekInfo{
		Offset: stat.Size() - size,
		Whence: io.SeekCurrent,
	}

	var t, err1 = tail.TailFile(filepath, tail.Config{Location: &seek})

	if err1 != nil {
		return nil, err
	}

	var lines []string

	for line := range t.Lines {
		lines = append(lines, line.Text)
	}

	return lines, nil
}

func SendError(c *gin.Context, err error) {

	c.JSON(http.StatusBadRequest, gin.H{
		"message": err.Error(),
	})
}

//go:embed static
var bundle embed.FS

//go:embed static/index.html
var indexTemplate string

func StartHttp(port *int) {
	bundleFs := http.FS(bundle)

	r := gin.Default()
	r.StaticFS("/static", bundleFs)

	r.GET("/", func(c *gin.Context) {
		templ, err := template.New("index").Parse(indexTemplate)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		}

		templ.Execute(c.Writer, nil)

	})

	r.GET("/getpid", func(c *gin.Context) {

		query := c.Query("name")
		if query == "" {
			SendError(c, errors.New("name is required"))
			return
		}

		queries := strings.Split(query, ",")
		c.JSON(http.StatusOK, FindProcess(queries))

	})

	r.GET("/read", func(c *gin.Context) {

		query := c.Query("filepath")
		size := c.DefaultQuery("size", "200")
		intSize, err := strconv.ParseInt(size, 10, 64)

		if err != nil {
			SendError(c, err)
			return
		}

		lines, err := GetLastLines(query, intSize)
		if err != nil {
			SendError(c, err)
			return
		}

		c.JSON(http.StatusOK, lines)
	})

	r.Run(":" + strconv.Itoa(*port))
}

func main() {
	flag.Usage = func() {
		fmt.Fprintln(os.Stderr, "Usage: gops")
		fmt.Fprintln(os.Stderr, "--port=number (default 4900)")
	}

	port := flag.Int("port", 4900, "--port")
	flag.Parse()
	StartHttp(port)
}
