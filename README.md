# AWS Static Website Hosting & Infrastructure Automation using Terraform

![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-Static%20Website-569A31)
![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-Ubuntu-FF9900)
![Nginx](https://img.shields.io/badge/Nginx-Web%20Server-009639)
![GitHub](https://img.shields.io/badge/GitHub-Version%20Control-black)
![HCL](https://img.shields.io/badge/HCL-Terraform%20Configuration-623CE4)

## 📌 Project Overview

This project demonstrates the deployment of a static website on Amazon Web Services (AWS) using Infrastructure as Code (IaC) with Terraform.

The project implements two AWS-based hosting approaches:

1. **Amazon S3 Static Website Hosting**
2. **Amazon EC2 + Nginx Web Hosting**

The AWS infrastructure is provisioned and managed using Terraform written in **HCL (HashiCorp Configuration Language)**.

The website source code is maintained in GitHub and is automatically deployed to the Terraform-managed EC2 instance through EC2 `user_data`.

The project focuses on practical implementation of:

- Cloud infrastructure
- Infrastructure as Code
- AWS networking
- IAM/security concepts
- S3
- EC2
- Security Groups
- Linux
- Nginx
- Git/GitHub
- Terraform
- HCL
- Automated server provisioning
- State management
- Infrastructure reproducibility

---

# 🏗️ Architecture

```text
                         Internet
                            │
                            │
                    ┌───────▼────────┐
                    │     GitHub     │
                    │ Website Source │
                    └───────┬────────┘
                            │
                            │
                     Terraform / HCL
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
      ┌───────────────┐           ┌────────────────┐
      │   Amazon S3   │           │   Amazon EC2   │
      │ Static Website│           │ Ubuntu Server  │
      └───────┬───────┘           └───────┬────────┘
              │                           │
              │                           ▼
              │                         Nginx
              │                           │
              │                           ▼
              │                     Website Files
              │
              ▼
        Static Website
````

---

# 🎯 Project Objectives

The main objectives of this project are:

* Learn AWS infrastructure provisioning.
* Understand Infrastructure as Code.
* Provision resources using Terraform.
* Understand Terraform HCL syntax.
* Deploy a website using Amazon S3.
* Deploy the same website on an EC2 instance.
* Configure a Linux web server using Nginx.
* Implement basic AWS network security.
* Restrict SSH access using a CIDR-based Security Group rule.
* Automate EC2 server configuration using `user_data`.
* Store infrastructure configuration in GitHub.
* Understand Terraform state management.
* Build a recruiter-ready AWS/DevOps portfolio project.

---

# 🛠️ Technologies Used

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| AWS              | Cloud infrastructure             |
| Amazon S3        | Static website hosting           |
| Amazon EC2       | Web server                       |
| Ubuntu 24.04     | EC2 operating system             |
| Nginx            | Web server                       |
| Terraform        | Infrastructure as Code           |
| HCL              | Terraform configuration language |
| Git              | Version control                  |
| GitHub           | Source code repository           |
| AWS CLI          | AWS resource management          |
| PowerShell / CMD | Local automation                 |
| HTML             | Website structure                |
| CSS              | Website styling                  |
| JavaScript       | Website scripting                |

---

# ☁️ AWS Services Used

## 1. Amazon S3

Amazon S3 is used to host the static version of the website.

Terraform provisions:

* S3 bucket
* Static website configuration
* Public access configuration
* Bucket policy
* Website files

Resources:

```hcl
aws_s3_bucket
aws_s3_bucket_website_configuration
aws_s3_bucket_public_access_block
aws_s3_bucket_policy
aws_s3_object
```

The website files are uploaded directly through Terraform:

```text
index.html
style.css
script.js
```

---

# 2. Amazon EC2

An Ubuntu EC2 instance is provisioned using Terraform.

The EC2 instance is configured with:

* Ubuntu 24.04
* `t3.micro`
* Public IP
* Default VPC
* Default subnet
* Security Group
* SSH access
* HTTP access

Terraform automatically configures the server using `user_data`.

---

# 3. Security Groups

A dedicated Security Group is created for the website server.

### Inbound Rules

| Protocol | Port | Source          | Purpose               |
| -------- | ---: | --------------- | --------------------- |
| TCP      |   80 | `0.0.0.0/0`     | HTTP website access   |
| TCP      |   22 | `<admin-ip>/32` | Restricted SSH access |

### Outbound

The instance is allowed outbound traffic for required operations such as:

* Installing packages
* Accessing GitHub
* Updating Ubuntu packages
* Downloading dependencies

Example Terraform configuration:

```hcl
resource "aws_security_group" "web" {

  name        = "aws-static-website-web-sg"
  description = "Security group for static website EC2"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"

    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"

    cidr_blocks = [var.admin_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"

    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

SSH access is restricted using:

```text
103.31.41.25/32
```

rather than exposing SSH to the entire internet.

---

# 🔐 IAM & AWS Security Concepts

IAM stands for **Identity and Access Management**.

IAM controls:

* Who can access AWS
* What resources they can access
* Which actions they can perform
* Which AWS services can interact with other services

Although this project does not create a custom IAM role through Terraform, IAM security principles are considered in the infrastructure design.

### IAM Concepts Relevant to This Project

```text
IAM
│
├── Users
│
├── Groups
│
├── Roles
│
├── Policies
│
└── Permissions
```

### Principle of Least Privilege

A production implementation should grant only the permissions required for a particular task.

For example:

```text
Developer
   │
   ▼
IAM Role
   │
   ▼
Limited AWS Permissions
   │
   ├── S3 access
   ├── EC2 access
   └── Terraform-related permissions
```

AWS credentials should never be hard-coded inside:

* Terraform files
* GitHub repositories
* Source code
* `user_data`
* README files

For local development, AWS CLI authentication is used instead of storing access keys directly in the Terraform configuration.

---

# 🏗️ Infrastructure as Code

Terraform is used to define AWS infrastructure as code.

Instead of manually creating resources through the AWS Console:

```text
Manual Approach

AWS Console
     │
     ├── Create S3
     ├── Configure S3
     ├── Create VPC resources
     ├── Create Security Group
     ├── Launch EC2
     └── Configure Server
```

Terraform provides:

```text
Terraform HCL
      │
      ▼
terraform plan
      │
      ▼
terraform apply
      │
      ▼
AWS Infrastructure
```

This provides:

* Repeatability
* Version control
* Infrastructure consistency
* Automation
* Change tracking
* Reproducibility

---

# 📁 Terraform Project Structure

```text
terraform/
│
├── provider.tf
├── variables.tf
├── main.tf
├── output.tf
│
├── .terraform.lock.hcl
│
└── terraform.tfstate
```

---

# 📄 Terraform Configuration Files

## provider.tf

Defines Terraform and AWS provider requirements.

Example:

```hcl
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

---

# 📄 variables.tf

Terraform variables are used to avoid hard-coding configuration values.

Example:

```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "admin_cidr" {
  description = "CIDR allowed to SSH into EC2"
  type        = string
}
```

This allows the infrastructure to be customized without changing the main resource definitions.

---

# 📄 main.tf

The main infrastructure configuration contains:

### S3

```hcl
aws_s3_bucket
aws_s3_bucket_website_configuration
aws_s3_bucket_public_access_block
aws_s3_bucket_policy
aws_s3_object
```

### EC2

```hcl
aws_instance
```

### Security

```hcl
aws_security_group
```

### Data Sources

```hcl
aws_vpc
aws_subnets
aws_ami
```

---

# 📄 output.tf

Terraform outputs provide useful information after deployment.

Example:

```hcl
output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "website_endpoint" {
  description = "S3 static website endpoint"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.web.public_dns
}
```

---

# 🔄 Terraform Workflow

The project follows the standard Terraform workflow:

```text
Write HCL
   │
   ▼
terraform init
   │
   ▼
terraform fmt
   │
   ▼
terraform validate
   │
   ▼
terraform plan
   │
   ▼
terraform apply
   │
   ▼
AWS Infrastructure
```

---

# 🧪 Terraform Commands Used

## Initialize Terraform

```bash
terraform init
```

Downloads the required providers.

---

## Format Terraform code

```bash
terraform fmt
```

Formats HCL files according to Terraform conventions.

---

## Validate configuration

```bash
terraform validate
```

Checks whether the Terraform configuration is syntactically and structurally valid.

---

## Preview infrastructure changes

```bash
terraform plan
```

Shows what Terraform intends to create, modify, or destroy.

---

## Create infrastructure

```bash
terraform apply
```

Creates the AWS resources defined in Terraform.

---

## Show outputs

```bash
terraform output
```

Displays values such as:

```text
S3 bucket name
S3 website endpoint
EC2 public IP
EC2 public DNS
```

---

## Inspect Terraform state

```bash
terraform state list
```

Shows resources currently managed by Terraform.

---

# 🗃️ Terraform State

Terraform maintains infrastructure state in:

```text
terraform.tfstate
```

The state allows Terraform to understand:

```text
Terraform Configuration
        │
        ▼
Terraform State
        │
        ▼
Existing AWS Infrastructure
```

The state file contains infrastructure information and should be handled carefully.

For production environments, remote state is recommended.

A typical production architecture could use:

```text
S3
 │
 └── Terraform Remote State

DynamoDB / locking mechanism
 │
 └── State Locking
```

The current project uses local Terraform state for learning and demonstration.

---

# 🚀 EC2 Automated Provisioning

The EC2 instance uses Terraform `user_data`.

The bootstrap process performs:

```text
EC2 Launch
    │
    ▼
Ubuntu Initialization
    │
    ▼
apt-get update
    │
    ▼
Install Nginx + Git
    │
    ▼
Start Nginx
    │
    ▼
Clone GitHub Repository
    │
    ▼
Copy Website Files
    │
    ▼
Restart Nginx
    │
    ▼
Website Available
```

Example:

```bash
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
```

This removes the need to manually configure Nginx after launching the instance.

---

# 🌐 Website

The website consists of:

```text
index.html
style.css
script.js
```

### HTML

Defines the structure and content.

### CSS

Defines:

* Layout
* Typography
* Colors
* Sections
* Cards
* Responsive styling

### JavaScript

Provides client-side functionality and browser-side scripting.

---

# 🔗 GitHub Integration

The website source code is stored in GitHub.

Repository:

```text
aws-static-website-devops
```

The EC2 bootstrap script retrieves the repository:

```bash
git clone https://github.com/harshaldhande/aws-static-website-devops.git
```

The deployment flow is:

```text
GitHub Repository
       │
       ▼
     Git
       │
       ▼
    EC2 User Data
       │
       ▼
   /var/www/html
       │
       ▼
     Nginx
       │
       ▼
    Website
```

---

# 📦 S3 Static Website Configuration

Terraform configures S3 for static website hosting.

```hcl
resource "aws_s3_bucket_website_configuration" "website" {

  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}
```

The bucket serves:

```text
index.html
style.css
script.js
```

---

# 🔓 S3 Public Access

For this learning implementation, the S3 website is configured for public read access.

The bucket policy permits:

```text
s3:GetObject
```

for website objects.

Example:

```hcl
policy = jsonencode({
  Version = "2012-10-17"

  Statement = [
    {
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"

      Action = "s3:GetObject"

      Resource = "${aws_s3_bucket.website.arn}/*"
    }
  ]
})
```

### Production Consideration

For a production architecture, the S3 bucket should generally remain private and be accessed through **Amazon CloudFront using Origin Access Control (OAC)** rather than exposing the bucket directly.

---

# 🌍 AWS Region

The infrastructure is deployed in:

```text
AWS Region:
ap-south-1

Region:
Asia Pacific (Mumbai)
```

---

# 🖥️ EC2 Environment

The Terraform-managed EC2 server uses:

```text
Operating System: Ubuntu 24.04
Instance Type: t3.micro
Web Server: Nginx
```

Terraform dynamically retrieves the latest matching Ubuntu AMI using an AWS data source.

Example:

```hcl
data "aws_ami" "ubuntu" {

  most_recent = true

  owners = ["099720109477"]

  filter {
    name = "name"

    values = [
      "ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"
    ]
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
```

This avoids hard-coding a specific AMI ID.

---

# 🌐 AWS Networking

The project uses the default AWS VPC and discovers available subnets using Terraform data sources.

```text
AWS Region
    │
    ▼
Default VPC
    │
    ▼
Subnet
    │
    ▼
Security Group
    │
    ▼
EC2
    │
    ▼
Public IP
    │
    ▼
Internet
```

Terraform retrieves the VPC dynamically:

```hcl
data "aws_vpc" "default" {
  default = true
}
```

And discovers subnets:

```hcl
data "aws_subnets" "default" {

  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
```

---

# 🔐 Security Considerations

Security was considered at the infrastructure level.

### SSH

SSH is restricted to a specific administrator IP:

```text
Administrator IP/32
```

Instead of:

```text
0.0.0.0/0
```

### HTTP

Port 80 is publicly accessible because the website needs to be reachable from the internet.

### AWS Credentials

Credentials should not be stored in:

```text
main.tf
provider.tf
GitHub
README.md
user_data
```

AWS CLI authentication is used for local Terraform execution.

### GitHub Security

No AWS access keys, secret keys, passwords, or tokens are committed to the repository.

---

# 📂 Repository Structure

```text
aws-static-website-devops/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
├── .gitignore
│
└── terraform/
    │
    ├── main.tf
    ├── provider.tf
    ├── variables.tf
    ├── output.tf
    ├── .terraform.lock.hcl
    └── terraform.tfstate
```

> `terraform.tfstate` and the `.terraform/` directory should not be committed to a public repository.

Recommended `.gitignore`:

```gitignore
.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
```

The provider lock file should remain tracked:

```text
.terraform.lock.hcl
```

---

# 🧑‍💻 Local Setup

## Prerequisites

Install:

* Git
* Terraform
* AWS CLI
* AWS account

Verify:

```bash
git --version
terraform version
aws --version
```

---

# 🔑 AWS Authentication

Configure AWS CLI authentication.

Verify the authenticated AWS identity:

```bash
aws sts get-caller-identity
```

The command should return the AWS account and identity information.

For production environments, use appropriate IAM identities, roles, or IAM Identity Center rather than using the AWS root account for automation.

---

# ⚙️ Terraform Deployment

Navigate to the Terraform directory:

```bash
cd terraform
```

Initialize:

```bash
terraform init
```

Format:

```bash
terraform fmt
```

Validate:

```bash
terraform validate
```

Check the plan:

```bash
terraform plan -var="admin_cidr=YOUR_PUBLIC_IP/32"
```

Apply:

```bash
terraform apply -var="admin_cidr=YOUR_PUBLIC_IP/32"
```

Enter:

```text
yes
```

After deployment:

```bash
terraform output
```

---

# 🔍 Verification

Check Terraform-managed resources:

```bash
terraform state list
```

Check EC2:

```bash
aws ec2 describe-instances
```

Check S3:

```bash
aws s3 ls
```

Test the website using the EC2 public IP:

```text
http://<EC2-PUBLIC-IP>
```

Test the S3 website endpoint:

```text
http://<S3-WEBSITE-ENDPOINT>
```

---

# 📊 Terraform Managed Resources

The current implementation manages:

```text
S3
│
├── aws_s3_bucket
├── aws_s3_bucket_website_configuration
├── aws_s3_bucket_public_access_block
├── aws_s3_bucket_policy
│
└── Website Objects
    ├── index.html
    ├── style.css
    └── script.js

EC2
│
├── aws_instance
│
└── aws_security_group
```

Terraform also uses AWS data sources for:

```text
Default VPC
Subnets
Ubuntu AMI
```

---

# 🧠 Key DevOps Concepts Demonstrated

This project demonstrates practical understanding of:

### Infrastructure as Code

Infrastructure is represented as version-controlled HCL files.

### Declarative Configuration

Terraform describes the desired infrastructure state rather than requiring manual step-by-step AWS commands.

### Idempotency

Running Terraform repeatedly should converge the infrastructure toward the declared configuration.

### Infrastructure State

Terraform tracks managed resources using state.

### Configuration Variables

Environment-specific values can be supplied through Terraform variables.

### Outputs

Deployment information can be exposed using Terraform outputs.

### Data Sources

Existing AWS infrastructure information can be queried dynamically.

### Automated Provisioning

EC2 configuration is performed through `user_data`.

### Version Control

Infrastructure and application code are maintained in Git.

---

# 🔄 End-to-End Deployment Flow

```text
                Developer
                    │
                    ▼
               GitHub Repo
                    │
                    │
              HTML/CSS/JS
                    │
                    ▼
               Terraform
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      Amazon S3           Amazon EC2
          │                   │
          │                 Ubuntu
          │                   │
          │                 Nginx
          │                   │
          │            GitHub Repository
          │                   │
          │                   ▼
          │              Website Files
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                 Internet
```

---

# 📈 Future Enhancements

The current implementation focuses on AWS, Terraform, EC2, S3, Linux, and basic automation.

Potential production-grade enhancements include:

## CI/CD

```text
GitHub
   │
   ▼
Jenkins / GitHub Actions
   │
   ▼
Terraform
   │
   ▼
AWS
```

## DevSecOps

Potential security integrations:

```text
SonarQube
Trivy
Checkov
OWASP Dependency Check
OWASP ZAP
DefectDojo
```

## Containerization

The application can be containerized using:

```text
Docker
Docker Compose
```

## Kubernetes

A future architecture could deploy containerized workloads using:

```text
Kubernetes
Amazon EKS
```

## Monitoring

Potential monitoring stack:

```text
Prometheus
Grafana
CloudWatch
ELK Stack
```

## CDN and HTTPS

A production website architecture could use:

```text
Route 53
   │
   ▼
CloudFront
   │
   ▼
Private S3
   │
   ▼
Origin Access Control
```

This would provide:

* HTTPS
* CDN caching
* Global content delivery
* Private S3 origin
* Better production security

---

# 🏆 Skills Demonstrated

```text
Cloud
├── AWS
├── S3
├── EC2
├── VPC
└── Security Groups

Infrastructure as Code
├── Terraform
├── HCL
├── Variables
├── Outputs
├── Data Sources
├── State
└── Resource Management

DevOps
├── Git
├── GitHub
├── Linux
├── Nginx
└── Automated Provisioning

Security
├── IAM Concepts
├── Least Privilege
├── Security Groups
├── SSH Restriction
└── Credential Management

Web
├── HTML
├── CSS
└── JavaScript
```

---

# 📚 What I Learned

Through this project, I gained practical experience with:

* Designing a basic AWS cloud architecture.
* Deploying static websites using Amazon S3.
* Launching and configuring EC2 instances.
* Working with Ubuntu Linux.
* Installing and configuring Nginx.
* Creating AWS Security Groups.
* Restricting SSH access using CIDR.
* Working with AWS CLI.
* Writing Terraform HCL.
* Using Terraform providers.
* Using Terraform variables.
* Using Terraform outputs.
* Using Terraform data sources.
* Managing Terraform state.
* Understanding Infrastructure as Code.
* Automating EC2 configuration using `user_data`.
* Connecting application source code with infrastructure.
* Managing cloud infrastructure through Git.

---

# 👨‍💻 Author

## Harshal Dhande

B.Tech – Electronics & Telecommunication Engineering
Vishwakarma Institute of Technology, Pune

PGCP-ITISS – CDAC Pune

Areas of Interest:

```text
Cloud Computing
DevOps
DevSecOps
AWS
Terraform
Kubernetes
Docker
Linux
Cybersecurity
Software Engineering
```

---

# ⭐ Project Highlights

```text
✔ AWS Cloud Infrastructure
✔ Infrastructure as Code
✔ Terraform HCL
✔ Amazon S3 Static Website
✔ Amazon EC2
✔ Ubuntu Linux
✔ Nginx
✔ Git & GitHub
✔ Security Groups
✔ Restricted SSH Access
✔ Terraform Variables
✔ Terraform Outputs
✔ Terraform Data Sources
✔ Terraform State Management
✔ EC2 Automated Provisioning
✔ GitHub-based Application Deployment
✔ IAM & Least-Privilege Concepts
✔ Production Architecture Considerations
```

---

# 📌 Project Status

**Status: Completed – Core Implementation**

Implemented:

* AWS S3 static website hosting
* AWS EC2 web server
* Nginx
* GitHub integration
* Terraform infrastructure
* Terraform state
* Security Group
* Restricted SSH
* EC2 automated provisioning
* Website deployment

Future enhancements are documented separately and are not represented as currently implemented components.

````

### One important correction before you paste it

Your actual repo currently has:

```text
terraform.tfstate
````

inside the `terraform/` directory. **Do not push that file to GitHub**, especially if the repository is public. Your `.gitignore` already should contain:

```gitignore
*.tfstate
*.tfstate.*
.terraform/
```

Then:

```cmd
git status
git add README.md .gitignore
git commit -m "Improve project documentation"
git push
```
