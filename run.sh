#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "Usage $0 [start|stop]"
  exit 1
fi

args="$1"

case $args in
  start)
    echo "starting server"
	  nohup pshttp >console.log 2>&1 &
	  echo $! > pid
    ;;

  stop)
    PID="$PWD/pid"
    echo "kill $(<"$PID")"
    kill $(<"$PID")
    rm $PID
    ;;

  *)
    echo "unknown argument"
    exit 1
    ;;
esac
