package main

import (
	"bufio"
	"bytes"
	"embed"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/net"
	"github.com/shirou/gopsutil/v3/process"
	"html/template"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

type Proc struct {
	Name          string
	Id            int32
	Ppid          int32
	Owner         string
	Cmdline       []string
	Environment   []Environment
	Status        []string
	Cwd           string
	Terminal      string
	OpenFilesStat []process.OpenFilesStat
	CreateTime    string
	Children      []Proc
	Connection    []net.ConnectionStat
	Background    bool
	Forground     bool
	CpuTimes      *cpu.TimesStat
}

type Environment struct {
	Key   string
	Value string
}

type PsTree struct {
	Row string `json:"row"`
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
	cmdline, _ := p.CmdlineSlice()
	envs, _ := p.Environ()
	status, _ := p.Status()
	openfiles, _ := p.OpenFiles()
	createtime, _ := p.CreateTime()
	connections, _ := p.Connections()
	terminal, _ := p.Terminal()
	ppid, _ := p.Ppid()
	cwd, _ := p.Cwd()
	background, _ := p.Background()
	forground, _ := p.Foreground()
	cputimes, _ := p.Times()

	return Proc{
		Name:       name,
		Id:         p.Pid,
		Ppid:       ppid,
		Owner:      username,
		Cmdline:    cmdline,
		Cwd:        cwd,
		Background: background,
		Forground:  forground,
		CpuTimes:   cputimes,
		Environment: func() []Environment {
			list := make([]Environment, 0)

			for _, s := range envs {
				if s != "" {

					s := strings.Split(s, "=")
					list = append(list, Environment{
						Key:   s[0],
						Value: s[1],
					})
				}
			}
			return list
		}(),
		Status:   status,
		Terminal: terminal,

		OpenFilesStat: func() []process.OpenFilesStat {
			if openfiles == nil {
				return make([]process.OpenFilesStat, 0)
			}
			return openfiles
		}(),

		CreateTime: Time2String(createtime),

		Connection: connections,
		Children: func() []Proc {
			children := make([]Proc, 0)

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

	response := make([]Proc, 0)

	for _, p := range v {
		name, _ := p.Name()
		for _, q := range names {
			if strings.Compare(name, q) == 0 {
				response = append(response, CreateProc(p))
			}
		}
	}

	return response
}

func GetPstree(id string) ([]PsTree, error) {
	pstrees := make([]PsTree, 0)

	if id == "1" {
		return pstrees, nil
	}

	cmd, buf := exec.Command("pstree", "-pln", "-a", id), new(bytes.Buffer)
	path := make([]string, 1)
	path = append(path, os.Getenv("PATH"))
	cmd.Env = path
	cmd.Stdout = buf
	err := cmd.Run()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	s := bufio.NewScanner(buf)

	for s.Scan() {
		pstrees = append(pstrees, PsTree{
			Row: s.Text(),
		})
	}

	return pstrees, nil

}

func GetLastLines(filepath string, size int64) ([]string, error) {

	tail, buf := exec.Command("tail", fmt.Sprintf("-n%d", size), filepath), new(bytes.Buffer)
	path := make([]string, 1)
	path = append(path, os.Getenv("PATH"))
	tail.Env = path

	tail.Stdout = buf
	err := tail.Run()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	s := bufio.NewScanner(buf)
	var lines []string
	for s.Scan() {
		text := s.Text()
		if text != "" {
			lines = append(lines, s.Text()+"\n")
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

func staticFile(c *gin.Context) {
	c.FileFromFS("build"+c.Request.RequestURI, bundleFs)
	c.Status(http.StatusOK)
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

	r.GET("/favicon.ico", staticFile)
	r.GET("/manifest.json", staticFile)
	r.GET("/logo512.png", staticFile)
	r.GET("/logo192.png", staticFile)

	r.GET("/config", func(c *gin.Context) {
		c.JSON(http.StatusOK, config)
	})

	r.GET("/pid", func(c *gin.Context) {
		c.JSON(http.StatusOK, FindProcess(config.Procs))
	})

	r.GET("/pstree/:id", func(c *gin.Context) {
		id := c.Param("id")
		tree, err := GetPstree(id)

		if err != nil {
			SendError(c, err)
			return
		}

		c.JSON(http.StatusOK, tree)
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
	fmt.Printf("server starting on %d", config.Server.Port)
	StartHttp(config.Server.Port)
}
