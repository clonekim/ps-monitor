package main

import "fmt"

type LOGTYPE int

const (
	SHELL = iota
	FILE
)

var logtypes = [...]string{
	"SHELL",
	"FILE",
}

func (l LOGTYPE) String() string { return logtypes[l] }

func main() {

	log := LOGTYPE(0)

	fmt.Println(log.String())
}
