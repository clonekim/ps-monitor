package env

import (
	"bufio"
	"gopkg.in/yaml.v3"
	"io"
	"os"
)

type Program struct {
	Label string `yaml:"label" json:"label"`
	Match string `yaml:"match" json:"match"`
	User  string `yaml:"user" json:"user"`
}

type LOG_TYPE int

const (
	SHELL = iota
	FILE
)

var logtypes = [...]string{
	"SHELL",
	"FILE",
}

func (l LOG_TYPE) String() string { return logtypes[l] }

type Config struct {
	Server struct {
		Port  int  `yaml:"port" json:"port"`
		Debug bool `yaml:"debug" json:"debug"`
	} `json:"server"`

	Program struct {
		RatioFormat string   `yaml:"ratioformat" json:"ratioformat"`
		MatchLevel  int      `yaml:"match" json:"match"`
		Processes   []string `yaml:"processes" json:"processes"`
	} `json:"program"`

	Logs []string `yaml:"logs" json:"logs"`
}

func LoadConfig() *Config {

	file, err := os.Open("config.yml")
	if err != nil {
		panic(err)
	}

	buf, err := io.ReadAll(bufio.NewReader(file))
	if err != nil {
		panic(err)
	}

	config := &Config{}
	err = yaml.Unmarshal(buf, config)
	if err != nil {
		panic(err)
	}

	return config
}
