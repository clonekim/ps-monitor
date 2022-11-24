package command

import (
	"bufio"
	"bytes"
	"fmt"
	"github.com/shirou/gopsutil/v3/net"
	"github.com/shirou/gopsutil/v3/process"
	"log"
	"os"
	"os/exec"
	"psmon/env"
	"strings"
	"time"
)

type ColorMap struct {
	Color   *string `json:"color"`
	BgColor *string `json:"bgColor"`
}

type Proc struct {
	Name        string                  `json:"name"`
	Label       string                  `json:"label"`
	Id          int32                   `json:"id"`
	Ppid        int32                   `json:"ppid"`
	User        string                  `json:"user"`
	Cmdline     []string                `json:"cmdline"`
	Environment []Environment           `json:"environment"`
	Status      []string                `json:"status"`
	Terminal    string                  `json:"tty"`
	CreateTime  string                  `json:"createTime"`
	Connection  []net.ConnectionStat    `json:"connection"`
	OpenFile    []process.OpenFilesStat `json:"openFile"`
	CpuPercent  string                  `json:"cpuPercent"`
	MemPercent  string                  `json:"memPercent"`
	Colors      ColorMap                `json:"colors"`
}

type Environment struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

type Log struct {
	Value string `json:"value"`
}

type Logger struct {
	Logs     []Log  `json:"logs"`
	FilePath string `json:"filepath"`
	Parsed   string `json:"parsed"`
}

func Time2String(value int64) string {
	loc, _ := time.LoadLocation("Asia/Seoul")
	v := time.UnixMilli(value)
	v = v.In(loc)
	return v.Format("2006-01-02 15:04:05")
}

func CreateProc(names []string) []Proc {
	plist := make([]Proc, 0)

	for _, i := range names {
		n := strings.Split(i, ",")

		switch len(n) {

		case 5:
			plist = append(plist, Proc{
				Label:  n[0],
				Name:   n[1],
				User:   n[2],
				Colors: ColorMap{Color: &n[3], BgColor: &n[4]},
			})
			break
		default:
			plist = append(plist, Proc{
				Label: i,
				Name:  i,
			})
		}

	}

	return plist

}

func UpdateProc(proc *Proc, p *process.Process) {

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
	openFiles, _ := p.OpenFiles()

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

	if openFiles == nil {
		proc.OpenFile = make([]process.OpenFilesStat, 0)
	} else {
		proc.OpenFile = openFiles
	}

	proc.Id = p.Pid
	proc.Ppid = ppid
	proc.User = username
	proc.Cmdline = cmdline
	proc.Environment = getEnv()
	proc.Status = status
	proc.Terminal = terminal
	proc.CreateTime = Time2String(createtime)
	proc.CpuPercent = fmt.Sprintf(envConf.Program.RatioFormat, cpuPercent)
	proc.MemPercent = fmt.Sprintf(envConf.Program.RatioFormat, memPercent)

	if connections == nil {
		proc.Connection = make([]net.ConnectionStat, 0)
	} else {
		proc.Connection = connections
	}
}

var envConf *env.Config

func FindProcess(config *env.Config) *[]Proc {
	envConf = config
	plist := CreateProc(config.Program.Processes)
	v, _ := process.Processes()

	fnMatchUser := func(user string, puser string) bool {

		if user == "" {
			return true
		}

		return user == puser
	}

	fnNameComparer := func(cmd string, name string) bool {
		start := strings.Index(cmd, name)

		if config.Program.MatchLevel == 2 {
			return strings.Compare(cmd, name) == 0
		}

		if config.Program.MatchLevel == 1 {
			return strings.Compare(cmd[start:start+len(name)], name) == 0
		}

		return false
	}

	for _, p := range v {
		cmd, _ := p.Name()
		user, _ := p.Username()

		if cmd == "" {
			continue
		}

		for i, j := range plist {

			start := strings.Index(cmd, j.Name)
			if start > -1 && j.Id == 0 {

				if fnMatchUser(j.User, user) && fnNameComparer(cmd, j.Name) {
					log.Printf("Match(%d) -> %s %s\n", config.Program.MatchLevel, cmd, j.Name)
					UpdateProc(&plist[i], p)
					break
				}

			}

		}
	}

	return &plist
}

func KillProcess(id int) error {

	return nil
}

func Output(commands string) ([]string, error) {

	log.Println(commands)

	cmd, buf := exec.Command("bash", "-c", commands), new(bytes.Buffer)
	envs := make([]string, 1)
	envs = append(envs, os.Getenv("PATH"))

	cmd.Env = envs
	cmd.Stdout = buf
	cmd.Stderr = buf
	err := cmd.Run()

	s := bufio.NewScanner(buf)
	lines := make([]string, 0)
	for s.Scan() {
		text := s.Text()
		if text != "" {
			lines = append(lines, text)
		}
	}

	if err != nil {
		log.Fatalln(err)
		return lines, err
	}

	return lines, nil

}

func GetLastLines(filepath string, size int) ([]string, error) {
	tail, buf := exec.Command("tail", fmt.Sprintf("-n%d", size), filepath), new(bytes.Buffer)
	path := make([]string, 1)
	path = append(path, os.Getenv("PATH"))
	tail.Env = path
	tail.Stdout = buf
	tail.Stderr = buf
	err := tail.Run()

	s := bufio.NewScanner(buf)
	var lines []string
	for s.Scan() {
		text := s.Text()
		if text != "" {
			lines = append(lines, text)
		}
	}

	if err != nil {
		return lines, err
	}

	return lines, nil
}
