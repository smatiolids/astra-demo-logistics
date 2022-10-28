package controller

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/smatiolids/golang-backend/service"
)

type ProducerController interface {
	Produce(ctx *gin.Context)
}

type controller struct {
	service service.ProducerService
}

func New(service service.ProducerService) ProducerController {
	return controller{
		service: service,
	}
}

func (c *controller) Produce(ctx *gin.Context) {
	var filepath JSON
	ctx.BindJSON(&filepath)
	fmt.Println(filepath)
	return c.service.Produce(filepath)
}
