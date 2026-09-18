# ============================================================
# S3 BUCKET
# ============================================================

resource "aws_s3_bucket" "website" {
  bucket = "harshal-aws-static-website-terraform-2026"

  tags = {
    Name        = "AWS Static Website"
    Project     = "aws-static-website-devops"
    Environment = "Development"
  }
}


# ============================================================
# S3 WEBSITE CONFIGURATION
# ============================================================

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}


# ============================================================
# S3 PUBLIC ACCESS SETTINGS
# ============================================================

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}


# ============================================================
# S3 BUCKET POLICY
# ============================================================

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id

  depends_on = [
    aws_s3_bucket_public_access_block.website
  ]

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.website.arn}/*"
      }
    ]
  })
}


# ============================================================
# UPLOAD INDEX.HTML
# ============================================================

resource "aws_s3_object" "index" {
  bucket = aws_s3_bucket.website.id

  key          = "index.html"
  source       = "../index.html"
  content_type = "text/html"

  etag = filemd5("../index.html")
}


# ============================================================
# UPLOAD CSS
# ============================================================

resource "aws_s3_object" "css" {
  bucket = aws_s3_bucket.website.id

  key          = "style.css"
  source       = "../style.css"
  content_type = "text/css"

  etag = filemd5("../style.css")
}


# ============================================================
# UPLOAD JAVASCRIPT
# ============================================================

resource "aws_s3_object" "js" {
  bucket = aws_s3_bucket.website.id

  key          = "script.js"
  source       = "../script.js"
  content_type = "application/javascript"

  etag = filemd5("../script.js")
}


# ============================================================
# DEFAULT VPC
# ============================================================

data "aws_vpc" "default" {
  default = true
}


# ============================================================
# DEFAULT SUBNETS
# ============================================================

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}


# ============================================================
# UBUNTU AMI
# ============================================================

data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}


# ============================================================
# SECURITY GROUP
# ============================================================

resource "aws_security_group" "web" {
  name        = "aws-static-website-web-sg"
  description = "Security group for static website EC2"
  vpc_id      = data.aws_vpc.default.id

  # HTTP
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  # Outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "aws-static-website-web-sg"
    Project = "aws-static-website-devops"
  }
}


# ============================================================
# EC2 INSTANCE
# ============================================================

resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  subnet_id = data.aws_subnets.default.ids[0]

  vpc_security_group_ids = [
    aws_security_group.web.id
  ]

  associate_public_ip_address = true

  # MUST match the AWS EC2 Key Pair name
  key_name = "aws_services"

  user_data = <<-EOF
              #!/bin/bash

              apt-get update -y
              apt-get install -y nginx git

              systemctl enable nginx
              systemctl start nginx

              rm -rf /var/www/html/*

              cd /tmp

              git clone https://github.com/harshaldhande/aws-static-website-devops.git

              cp -r aws-static-website-devops/* /var/www/html/

              systemctl restart nginx
              EOF

  tags = {
    Name        = "aws-static-website-server-terraform"
    Project     = "aws-static-website-devops"
    Environment = "Development"
  }
}