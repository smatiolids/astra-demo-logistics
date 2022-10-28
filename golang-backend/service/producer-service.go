package service

type ProducerService interface {
	Produce()
}

type producerService struct {
}

func New() ProducerService {
	return &producerService{}
}

func (service *producerService) Produce() {

}
