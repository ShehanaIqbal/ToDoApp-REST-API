const Joi = require('@hapi/joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses=[
    {id:1,name:'course 1'},
    {id:2,name:'course 2'},
    {id:3,name:'course 3'},
    {id:4,name:'course 4'}
]

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.get('/api/courses',(req,res)=>{
    res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{
    //print queries
    // res.send(req.query);
    const course=courses.find( c => c.id===parseInt(req.params.id));
    if (!course){
        res.status(404,"Course not found");
    }else{
        res.send(course);
    }
});

app.post('/api/courses',(req,res)=>{

    const {error}=validateCourse(req.body);
        if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const course={
        id:courses.length+1,
        name:req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id',(req,res)=>{

    const course=courses.find( c => c.id===parseInt(req.params.id));
    if (!course){
        return res.status(404,"Course not found");
    }else{
        const {error}=validateCourse(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
            return;
        }else{
            course.name=req.body.name;
            res.send(course);
        }
    }
});

app.delete('/api/courses/:id',(req,res)=>{

    const course=courses.find( c => c.id===parseInt(req.params.id));
    if (!course){
        res.status(404,"Course not found");
    }else{
        const {error}=validateCourse(req.body);
        if(error){
            res.status(400).send(error.details[0].message);
            return;
        }else{
            const index = courses.indexOf(course);
            courses.splice(index,1);
            res.send(course);
        }
    }
});

function validateCourse(course){
    const schema=Joi.object({
        name:Joi.string().min(3).required(),
        id:Joi.required()});
    
    return schema.validate(course);
}

// PORT
const port=process.env.PORT || 3000;
app.listen(port,()=>console.log('Listening on port 3000...'));
