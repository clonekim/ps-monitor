package main

import (
	"embed"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"io"
	"net/http"
	"psmon/command"
	"psmon/env"
	"strconv"
	"strings"
)

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

func SendError(c *gin.Context, err error) {
	c.JSON(http.StatusBadRequest, gin.H{
		"message": err.Error(),
	})
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

	r.GET("/ps", func(c *gin.Context) {
		c.JSON(http.StatusOK, command.FindProcess(config))
	})

	r.GET("/log", func(c *gin.Context) {

		filepath := c.Query("filepath")
		size := c.DefaultQuery("size", "200")
		intSize, err := strconv.Atoi(size)

		if err != nil {
			SendError(c, err)
			return
		}

		filepaths := strings.Split(filepath, ",")
		var lines []string
		var parsed string

		if len(filepaths) == 2 {
			toLogType, _ := strconv.Atoi(filepaths[0])

			switch env.LOG_TYPE(toLogType) {

			case env.SHELL:
				lines, err = command.Output(fmt.Sprintf(filepaths[1], intSize))
				break

			case env.FILE:
				lines, err = command.GetLastLines(filepaths[1], intSize)
				break
			}

		} else {
			SendError(c, errors.New("filepath is not valid"))
			return
		}

		if err != nil {
			SendError(c, err)
			return
		}

		c.JSON(http.StatusOK, command.Logger{

			Logs: func() []command.Log {
				logs := make([]command.Log, 0)
				for _, l := range lines {
					logs = append(logs, command.Log{Value: l})
				}
				return logs
			}(),
			FilePath: filepath,
			Parsed:   parsed,
		})
	})

	r.DELETE("/kill/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			SendError(c, err)
			return
		}

		err = command.KillProcess(id)

		if err != nil {
			SendError(c, err)
			return
		}

		c.Status(http.StatusNoContent)
	})

	r.Run(":" + strconv.Itoa(port))
}

var config *env.Config

func main() {
	config = env.LoadConfig()
	StartHttp(config.Server.Port)
}
