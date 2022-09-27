package main

import (
	"bufio"
	"fmt"
	"gopkg.in/yaml.v3"
	"io"
	"os"
)

type Config struct {
	Server struct {
		Port  int  `yaml:port`
		Debug bool `yaml:debug`
	}
	Procs []string `yaml:procs`
	Logs  []string `yaml:logs`
}

func GetConfig() *Config {

	file, err := os.Open("config.yaml");
	if err != nil {
		panic(err)
	}

	fmt.Println("reading config.yaml")
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
