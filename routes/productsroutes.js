const express = require('express');
const productscontroller = require('../controller/productscontroller');
const { upload } = require('../middlewares/multer');


const router = express.Router();
router.post("/createproduct",upload.single("product_image"),productscontroller.createproducts)
router.get('/allproducts',  productscontroller.getallproducts);
router.post('/delete/:_id',  productscontroller.deleteproducts);
router.get('/update/:_id',  productscontroller.updateproducts);
router.post('/catagory',upload.single('catagory_image'),productscontroller.catgoryinsert);
router.get('/getcatagory',  productscontroller.getallcatagory);
module.exports = router;
