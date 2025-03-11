const productsmodel = require("../models/productsmodel");
const catagorymodel = require("../models/catagorymodel");



/// save the products///
const createproducts = async (req, res) => {
    const { productname, product_description, product_price, catagory, grams, rating } = req.body;
    const product_image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(product_image);
    try {
        const newproducts = new productsmodel({ productname, product_description, product_image, product_price, catagory, grams, rating })
        await newproducts.save()
        res.status(201).send("products created");
    } catch (err) {
        res.status(201).send("products failed");
        console.log(err);
    }
}
//get all products//
const getallproducts = async (req, res) => {
    try {
        const allproducts = await productsmodel.aggregate([
            {
                $lookup: {
                    from: "catagorys",
                    localField: "catagory",
                    foreignField: "_id",
                    as: "data",
                }
            },
            {
                $unwind: {
                    path: "$data"
                }
            },
              {
                $group: {
                    _id: "$data._id",
                    catagoryname:{$first:"$data.Name"},
                    products: {
                        $push: {
                            id:"$_id",
                            name:"$productname",
                            description:"$product_description",
                            image:"$product_image",
                            price:"$product_price",
                            rating:"$rating",
                            grams:"$grams",
                            quantity:"$quantity",
                            stuck:"$stuck",
                            firstcommision:"$firstcommision",
                            restofcommision:"$restofcommision",
                        }
                    }
                }
            }
        ])
      
        if (allproducts) {
            res.send(allproducts).status(200);
        } else {
            res.status(404).send("not found");
        }
    } catch (error) {
        console.log(error);
    }
}
// deleteproducts/////
const deleteproducts = async (req, res) => {
    const { _id } = req.params;

    try {
        const found = await productsmodel.findOne({ _id });
        if (found) {

            await productsmodel.deleteOne({ _id });
            res.send("dlete successfully").status(200);
        }
        else {
            res.send("no products found").status(404)
        }
    } catch (error) {
        console.log(error);
    }
}
// update products///
const updateproducts = async (req, res) => {
    const { _id } = req.params;
    try {
        const find = await productsmodel.findById({ _id });
        res.send(find);
    } catch (error) {
        console.log(error);
    }
}

//create catagory///
const catgoryinsert = async (req, res) => {
    const { name } = req.body;
    const catagory_image = req.file ? `/uploads/${req.file.filename}` : null
    try {
        const catagory = await catagorymodel.findOne({ Name: name })
        if (!catagory) {
            await catagorymodel.create({ Name: name, image: catagory_image })
            res.send("created").status(201)
        }
        else {
            res.status(201).json({ message: "catagory exits" });
        }
    } catch (error) {
        console.log(error);
    }
}
/// get all catagory////
const getallcatagory = async (req, res) => {
    try {
        const catagory = await catagorymodel.find();
        res.status(200).json({ catagory });
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createproducts, getallproducts, deleteproducts, updateproducts, catgoryinsert, getallcatagory };


