Tata Motors Drive

The tool is a simple front-end that can be hosted on a web server and accessed via your browser. 

---

### Key features 

```
1. Securely login to Tata Motors Drive using Tata Motors Credentials.
2. List all objects within an S3 bucket in a folder structure hierarchy
3. Easily navigate between files
4. Download, share & delete objects - or upload files

```
---

### Documentation


### Installation

#### Deployment (development mode)

1. Clone the repository
2. Run `npm install` in the folder to install application dependencies
3. Run `npm start` to run application in development mode

#### Deployment (production) 

1. Run `npm run build`
2. Copy the contents of the `site` folder to your web server 

You can now access Tata Motors Drive.

#### Deployment (offline editor) 

1. Run `npm run simple`
2. Copy the offline editor from the `simple` folder 

### Contribution & support 
Feature suggestions, pull requests or questions are welcome!


---
### Dependencies
It uses a number of libraries - the most important are:  
- `minio`: utilizes some of the core structure & S3 SDK calls from the MinIO browser  
- `react-jsonschema-form`: This library enables the configuration editor GUI  
