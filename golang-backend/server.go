package main

import (
	"fmt"
	"net/http"

	"github.com/smatiolids/golang-backend/producer"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	server.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "OK",
		})
	})

	server.GET("/produce", func(ctx *gin.Context) {
		producer.Produce("/Users/samuel.matioli/work/astra-demo-logistics/data/org1-dev006-latlong.txt")

		ctx.JSON(http.StatusOK, gin.H{
			"message": "producer",
		})
	})

	server.POST("/upload", func(c *gin.Context) {
		// Multipart form
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			fmt.Println(file.Filename)

			// Upload the file to specific dst.
			c.SaveUploadedFile(file, "./tmp/"+file.Filename)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})

	server.Run(":4000")

}
