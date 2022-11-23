package env

import (
	"bufio"
	"gopkg.in/yaml.v3"
	"io"
	"os"
)

type Config struct {
	Server struct {
		Port  int  `yaml:"port" json:"port"`
		Debug bool `yaml:"debug" json:"debug"`
	} `json:"server"`

	Procs []string `yaml:"procs" json:"proc"`
	Logs  []string `yaml:"logs" json:"logs"`
}

func LoadConfig() *Config {

	file, err := os.Open("config.yaml")
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
