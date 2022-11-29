terraform {
 required_version = ">=1.0.0"
 required_providers {
   astra = {
     source = "datastax/astra"
     version = ">=2.0.0"
   }
 }
}

provider "astra" {
    token = var.ASTRA_TOKEN
}