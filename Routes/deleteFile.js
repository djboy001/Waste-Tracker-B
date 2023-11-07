const cloudinary = require('cloudinary').v2;
const router = require("express").Router();

router.post("/", async (req,res)=>{
    //.env must contain CLOUDINARY_URL
    const publicId = req?.body?.publicId;
    if(!publicId) res.status(500).json("No any public id");
    try{
        cloudinary.api
            .delete_resources([publicId])
            .then((result)=>{
                console.log(result);
                res.json(result);
            });
    }catch(err){
        console.log(err);
        res.status(500).json("An unknown error occurred");
    }
});

module.exports = router;