import express from "express";

const router = express.Router();

router.get("/", (req, res)=>{
    res.json({
            id:1,
            name:"arun",
            mobileNumber:123456789,
            since:"date"
    });
});

router.post("/", (req, res)=>{
    const {name , email, mobileNumber } = req.body;
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', options);
    res.json({
        name,
        email,
        mobileNumber,
        date:formattedDate
    })
});

router.put("/:id", (req, res)=>{
    const {name , email, mobileNumber } = req.body;
    const id = req.params.id;
    res.json({
        id,
        name,
        email,
        mobileNumber,
    })
});

router.delete("/:id", (req, res)=>{
    const id = req.params.id;
    res.json({
        id,
        message:"deleted successfully!"
    })
});

export default router;