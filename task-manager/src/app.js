const express = require('express');
const parser = require('body-parser');
const fs = require('fs');
const validateInput = require('./util/validation');
const app = express();
const port = 3000;

app.use(parser.json())

// GET /tasks: Retrieve all tasks.
// @params
app.get('/tasks', (req, res)=>{
    fs.readFile('../task.json', {encoding:'utf-8', flag: 'r'} , (err, data)=>{
        if(err){
            return res.status(500).json({"message":`Error encountered while fetching data. ${err}`});
        }
        return res.status(200).send(data);
    })
});

// GET /tasks/:id: Retrieve a single task by its ID.
// @params path params task id
app.get('/tasks/:id', (req, res)=>{
    const taskId = +req?.params?.id;
    fs.readFile('../task.json', {encoding:'utf-8', flag: 'r'} , (err, data)=>{
        if(err){
            return res.status(500).json({"message":`Error encountered while fetching data. ${err}`});
        }
        return res.status(200).send(JSON.parse(data).filter(el=> el.id === taskId));
    })
});

// POST /tasks: Create a new task.
// @params body params {"id":2,"name":"Assignment frontend","description":"This is a frontend assignment.","duration":"two days"}
app.post('/tasks', validateInput, (req, res)=>{
    const {id, title, description, completionStatus} = req.body;
    console.log(id, title, description, completionStatus);
    fs.readFile('../task.json', {encoding:'utf-8', flag:'r'}, (err,data)=>{
        console.log(data);
        if(err){
            return res.status(500).json(err);
        }
        const jsondata = JSON.parse(data);
        if((jsondata.filter(el=>el.id === +id).length>0)){
            console.log('resource already present');
            return res.status(403).json({"message":`resource already exists with given id ${id}`});
        }
        jsondata.push(req.body);
        console.log(jsondata);
        fs.writeFile('../task.json', JSON.stringify(jsondata), {encoding:'utf-8',flag:'w'}, (errWrite, dataWrite)=>{
            if(errWrite){
                return res.status(500).json(errWrite);
            }
            return res.status(201).json({"message":`New Task successfully created with id ${id}`});
        })

    })
})

// PUT /tasks/:id: Update an existing task by its ID.
// @params path params task id body params {"title":"Assignment frontend","description":"This is a frontend assignment.","duration":"two days"}
app.put('/tasks/:id', validateInput, (req, res)=>{
    const taskId = req?.params?.id;
    const { title, description, completionStatus} = req.body;
    fs.readFile('../task.json', {encoding:'utf-8', flag:'r'}, (err, data)=>{
        if(err){
            return res.status(500).json(err);
        }
        const jsondata = JSON.parse(data);
        const resource = jsondata.filter(el=>el.id=== +taskId);
        if(resource.length == 0){
            console.log("resource not present");
            return res.status(404).json({"message":`resource not present for modification`});
        }
        jsondata.forEach(element => {
            if(element.id === +taskId){
                element.title = title;
                element.description = description;
                element.completionStatus = completionStatus;
            }
        });
        fs.writeFile('../task.json', JSON.stringify(jsondata), {encoding:'utf-8',flag:'w'}, (errWrite, dataWrite)=>{
            if(errWrite){
                return res.status(500).json(errWrite);
            }
            return res.status(201).json({"message":`Task successfully updated with id ${taskId}`});
        })
    })
})

// DELETE /tasks/:id: Delete a task by its ID.
// @params path params task id
app.delete('/tasks/:id', (req, res)=>{
    const taskId = req?.params?.id;
    fs.readFile('../task.json', {encoding:'utf-8', flag:'r'}, (err, data)=>{
        if(err){
            return res.status(500).json(err);
        }
        const jsondata = JSON.parse(data);
        console.log("data === ", data);
        const resource = jsondata.filter(el=>el.id=== +taskId);
        if(resource.length == 0){
            console.log("resource not present");
            return res.status(404).json({"message":`resource not present for deletion`});
        }
        jsondata.forEach((element, index) => {
            if(element.id === +taskId){
                console.log("========*********hi", index);
                jsondata.splice(index,1);
            }
        });
        console.log(jsondata);
        fs.writeFile('../task.json', JSON.stringify(jsondata), {encoding:'utf-8',flag:'w'}, (errWrite, dataWrite)=>{
            if(errWrite){
                debugger
                console.log(errWrite)
                return res.status(500).json(errWrite);
            }
            debugger
            console.log(dataWrite);
            return res.status(201).json({"message":`Task deleted successfully with id ${taskId}`});
        })
    })
})

app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('server started');
    }
})