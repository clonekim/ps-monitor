package main

import (
	"embed"
	"errors"
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
			if strings.Contains(name, q) {
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
		text := line.Text
		
		if text != "" {
			lines = append(lines, line.Text)
		}
	}

	return lines, nil
}

func SendError(c *gin.Context, err error) {

	c.JSON(http.StatusBadRequest, gin.H{
		"message": err.Error(),
	})
}

//go:embed build
var bundle embed.FS

//go:embed build/index.html
var indexTemplate string

type embedFileSystem struct {
	fs http.FileSystem
}

func (e *embedFileSystem) Open(filepath string) (http.File, error) {
	return e.fs.Open("build/static" + filepath)
}

func getTemplate(path string, templateName string, w io.Writer) error {
	templ, err := template.New(path).Parse(templateName)
	if err != nil {
		return err
	}

	templ.Execute(w, nil)
	return nil
}

var bundleFs = http.FS(bundle)

func staticFile(path string, c *gin.Context) {
	c.FileFromFS("build"+path, bundleFs)
	c.Status(200)
}

func StartHttp(port int) {

	if !config.Server.Debug {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()
	r.StaticFS("/static", &embedFileSystem{fs: bundleFs})

	r.GET("/", func(c *gin.Context) {
		getTemplate("index", indexTemplate, c.Writer)
	})

    r.GET("/Log", func(c *gin.Context) {
		getTemplate("index", indexTemplate, c.Writer)
	})


	r.GET("/favicon.ico", func(c *gin.Context) {
		staticFile(c.Request.RequestURI, c)
	})

	r.GET("/manifest.json", func(c *gin.Context) {
		staticFile(c.Request.RequestURI, c)
	})

	r.GET("/logo512.png", func(c *gin.Context) {
		staticFile(c.Request.RequestURI, c)
	})

	r.GET("/logo192.png", func(c *gin.Context) {
		staticFile(c.Request.RequestURI, c)
	})

	r.GET("/config", func(c *gin.Context) {
		c.JSON(http.StatusOK, config)
	})

	r.GET("/pid", func(c *gin.Context) {
		c.JSON(http.StatusOK, FindProcess(config.Procs))
	})

	r.GET("/log", func(c *gin.Context) {

		filepath := c.Query("filepath")
		size := c.DefaultQuery("size", "200")
		intSize, err := strconv.ParseInt(size, 10, 64)

		if err != nil {
			SendError(c, err)
			return
		}

		lines, err := GetLastLines(filepath, intSize)

		if err != nil {
			SendError(c, err)
			return
		}

		c.JSON(http.StatusOK, lines)
	})

	r.DELETE("/kill/:id", func(c *gin.Context) {
		id, err := strconv.ParseInt(c.Param("id"), 10, 32)
		if err != nil {
			SendError(c, err)
			return
		}

		exist, err1 := process.PidExists(int32(id))

		if err1 != nil {
			SendError(c, err)
			return
		}

		if !exist {
			fmt.Printf("Pid:%d is not exist", id)
			c.Status(http.StatusNotFound)
			return

		}

		p := process.Process{
			Pid: int32(id),
		}

		err2 := p.Kill()

		if err2 != nil {
			SendError(c, err)
			return
		}

		c.Status(http.StatusNoContent)
	})

	r.Run(":" + strconv.Itoa(port))
}

var config *Config

func main() {
	config = GetConfig()
	fmt.Printf("server starting on %d\n", config.Server.Port)
	StartHttp(config.Server.Port)
}
