package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/smatiolids/golang-backend/producer"

	"github.com/gin-gonic/gin"
)

var (
	producerService producer.ProducerService
	tempFolder      = "./tmp/"
)

type ProduceFileReq struct {
	Filename string `json:"filename" binding:"required"`
}

func main() {
	server := gin.Default()

	// Read all the files in the tmp directory and start send the messages in parallel
	server.GET("/produce", func(ctx *gin.Context) {
		files, err := ioutil.ReadDir(tempFolder)
		var res []string
		if err != nil {
			log.Fatal(err)
		}

		for _, v := range files {
			if v.Name()[0:1] == "." {
				continue
			}
			go producerService.Produce(v.Name())
			res = append(res, v.Name())
		}

		ctx.JSON(http.StatusOK, res)
	})

	// Send all the records of a file to Astra Streaming
	server.POST("/produce-file", func(ctx *gin.Context) {
		var req ProduceFileReq

		if err := ctx.ShouldBindJSON(&req); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		fmt.Println("Producing filename: %s", req)

		if _, err := os.Stat(tempFolder + req.Filename); err == nil {
			go producerService.Produce(req.Filename)

			ctx.JSON(http.StatusOK, gin.H{
				"message": "Producer started",
			})
		} else if errors.Is(err, os.ErrNotExist) {
			// path/to/whatever does *not* exist
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "File not found"})
		}

	})

	// Save multiple files in the tmp folder
	server.POST("/upload", func(ctx *gin.Context) {
		// Multipart form
		form, _ := ctx.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			ctx.SaveUploadedFile(file, tempFolder+file.Filename)
		}
		ctx.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("%d files uploaded!", len(files))})
	})

	// Return a list with all the files available in the directory
	server.GET("/files", func(c *gin.Context) {
		files, err := ioutil.ReadDir(tempFolder)
		var res []string
		if err != nil {
			log.Fatal(err)
		}

		for _, v := range files {
			if v.Name()[0:1] == "." {
				continue
			}
			res = append(res, v.Name())
		}

		c.JSON(http.StatusOK, res)
	})

	// Removes all files from the directory
	server.DELETE("/files", func(c *gin.Context) {
		files, err := ioutil.ReadDir(tempFolder)
		var res []string
		if err != nil {
			log.Fatal(err)
		}

		for _, v := range files {
			if v.Name()[0:1] == "." {
				continue
			}
			e := os.Remove(tempFolder + v.Name())
			if e != nil {
				log.Fatal(e)
			}
			res = append(res, v.Name())
		}

		c.JSON(http.StatusOK, res)
	})

	server.Run("localhost:4000")
}
