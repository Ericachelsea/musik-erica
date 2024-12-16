const express = require('express')
const router = express.Router()

// import database
const connection = require('../config/database')

// insert data & validation
const {body, validationResult} =require('express-validator')


// read data
router.get('/', function(req,res){
    connection.query('SELECT * FROM posts ORDER BY id desc',
    function(error,rows){
        if(error){
            return res.status(500).json({
                status: false,
                message: 'database not connected',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Displaying data table posts',
                data:rows
            })
        }    
    })
})

//insert data
router.post('/',
    [
        body('Id artist').notEmpty(),
        body('Genre').notEmpty,
        body('Artist').notEmpty(),
        body('Album').notEmpty(),
        body('Song').notEmpty()
    ],(req,res)=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()})
        }

        //define formData
        let formData = {
            Id_artist: req.body.Id_artist,
            Genre: req.body.Genre,
            Artist: req.body.Artist,
            Album: req.body.Album,
            Song: req.body,Song
        }

        //insert data / query
        connection.query('INSERT INTO posts SET ?', formData,
            function(err,rows){
                if(err){
                    return res.status(500).json({
                        status: false,
                        message: 'Server mu error',
                    })
                }else{
                    return res.status(201).json({
                        status: true,
                        message: 'Success input data',
                        data: rows[0]
                    })
                }
            }
        )
    })

//Detail
router.get('/:id', function(req,res){
    let id = req.params.id

    connection.query(`SELECT * FROM posts WHERE ID=${id}`,
        function(error, rows){
            if(error){
                return res.status(500).json({
                    status:false,
                    message:'Server Error'
                })
            }

            //search posts
            if(rows.length <= 0){
                return res.status(404).json({
                    status: false,
                    message: 'Data is missing'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'display data posts',
                    data: rows[0],
                })
            }
        }
     )

})

// Update
router.patch('/update/:id',[
    //validation
    body('Artist').notEmpty(),
        body('Genre').notEmpty,
        body('Artist').notEmpty(),
        body('Album').notEmpty(),
        body('Song').notEmpty()
],(req,res)=>{
    const errors = validationResult (req)
    if(!errors.isEmpty()){
        return res.status(442).json({
            errors:errors.array()
        })
    }

    //id
    let id = req.params.id

    //data post
    let formData={
        Id_artist: req.body.Id_artist,
        Genre: req.body.Genre,
        Artist: req.body.Artist,
        Album: req.body.Album,
        Song: req.body,Song
    }

    // update query
    connection.query(`UPDATE posts set ? WHERE id=${id}`,
       formData,function(error,rows){
        if(error){
            return res.status(500).json({
                status: false,
                message: 'server error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Success update data'
            })
        }
       } 
    )
})

//Delete
router.delete('/delete/(:id)',
    function(req,res){
        let id = req.params.id

        connection.query(`DELETE FROM posts WHERE id=${id}`,
            function(error,rows){
                if(error) {
                    return res.status(500).json({
                        status: false,
                        message: 'Server error'
                    })
                } else {
                    return res.status(200).json({
                        status: true,
                        message: 'data has been delete'
                    })
                }
            }
        )
    })

module.exports = router