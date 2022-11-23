package command

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"github.com/shirou/gopsutil/v3/net"
	"github.com/shirou/gopsutil/v3/process"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"
)

type Proc struct {
	Name        string               `json:"name"`
	Label       string               `json:"label"`
	Bin         string               `json:"bin"`
	Id          int32                `json:"id"`
	Ppid        int32                `json:"ppid"`
	User        string               `json:"user"`
	Cmdline     []string             `json:"cmdline"`
	Environment []Environment        `json:"environment"`
	Status      []string             `json:"status"`
	Terminal    string               `json:"tty"`
	CreateTime  string               `json:"createTime"`
	Connection  []net.ConnectionStat `json:"connection"`
	CpuPersent  string               `json:"cpuPersent"`
	MemPersent  string               `json:"memPersent"`
}

type Environment struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Logger struct {
	Logs     []string `json:"logs"`
	FilePath string   `json:"filePath"`
}

func Time2String(value int64) string {
	loc, _ := time.LoadLocation("Asia/Seoul")
	v := time.UnixMilli(value)
	v = v.In(loc)
	return v.Format("2006-01-02 15:04:05")
}

var plist []Proc

func CreateProc(names []string) {
	plist = make([]Proc, 0)

	for _, i := range names {
		n := strings.Split(i, ",")

		plist = append(plist, Proc{
			Label: n[0],
			Name:  n[1],
		})
	}

}

func UpdateProc(proc *Proc, p *process.Process) {

	bin, _ := p.Name()
	username, _ := p.Username()
	cmdline, _ := p.CmdlineSlice()
	envs, _ := p.Environ()
	status, _ := p.Status()
	createtime, _ := p.CreateTime()
	connections, _ := p.Connections()
	terminal, _ := p.Terminal()
	ppid, _ := p.Ppid()
	cpuPercent, _ := p.CPUPercent()
	memPercent, _ := p.MemoryPercent()

	getEnv := func() []Environment {
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
	}

	proc.Bin = bin
	proc.Id = p.Pid
	proc.Ppid = ppid
	proc.User = username
	proc.Cmdline = cmdline
	proc.Environment = getEnv()
	proc.Status = status
	proc.Terminal = terminal
	proc.CreateTime = Time2String(createtime)
	proc.CpuPersent = fmt.Sprintf("%.2f", cpuPercent)
	proc.MemPersent = fmt.Sprintf("%.2f", memPercent)

	if connections == nil {
		proc.Connection = make([]net.ConnectionStat, 0)
	} else {
		proc.Connection = connections
	}
}

func FindProcess() *[]Proc {

	v, _ := process.Processes()

	for _, p := range v {
		cmd, _ := p.Name()

		if cmd == "" {
			continue
		}

		for i, j := range plist {

			start := strings.Index(cmd, j.Name)

			if start > -1 && j.Id == 0 && strings.Compare(cmd[start:start+len(j.Name)], j.Name) == 0 {
				log.Printf(" --> %s %s\n", cmd, j.Name)
				UpdateProc(&plist[i], p)
				break
			}
		}
	}

	return &plist
}

func KillProcess(id int) error {
	exist, err := process.PidExists(int32(id))

	if err != nil {
		return err
	}

	if !exist {
		return errors.New(fmt.Sprintf("Pid:%d is not exist", id))
	}

	p := process.Process{
		Pid: int32(id),
	}

	err = p.Kill()

	if err != nil {
		return err
	}

	return nil
}

func Output(commands string) ([]string, error) {

	cmd, buf := exec.Command("bash", "-c", commands), new(bytes.Buffer)
	envs := make([]string, 1)
	envs = append(envs, os.Getenv("PATH"))

	cmd.Env = envs
	cmd.Stdout = buf
	cmd.Stderr = os.Stderr
	err := cmd.Run()

	if err != nil {
		log.Fatalln(err)
		return nil, err
	}

	s := bufio.NewScanner(buf)
	var lines []string
	for s.Scan() {
		text := s.Text()
		if text != "" {
			lines = append(lines, text)
		}
	}

	return lines, nil

}

func GetLastLines(filepath string, size int) ([]string, error) {
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
