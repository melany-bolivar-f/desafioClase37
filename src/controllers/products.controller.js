const { productService } = require('../repositories/service.js')
const customError = require('../services/errors/customError')
const { EErrors } = require('../services/errors/enum')
const { generateProductErrorInfo } = require('../services/errors/generateErrorInfo')
const { logger } = require('../utils/logger')

class ProdcutsController {
    constructor(){
        this.productService = productService
    }

    getProducts = async (req,res)=>{
        try{
            const products = await this.productService.getProducts()
            return res.json({
                status: 'succes',
                payload: products
            })
        }catch (error){
            console.error(error)
            res.status(500).send('Server error')
        }
    }

    getProductById = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            if(!pid){
                customError.createError({
                    name: 'Not found a product',
                    cause: generateProductErrorInfo(filteredProduct),
                    message: 'Error, trying to found a product',
                    code: EErrors.DATABASE_ERROR,
                })
                //res.status(404).send("Product not exist")
            }
            const filteredProduct = await this.productService.getProductById(pid)
            res.json({
                status: 'succes',
                payload: filteredProduct
            })    
        }catch(error) {
            next(error)
                //res.status(500).send('Server error')
        }
    }

    addProduct = async (req,res,next)=>{
        try {
            const {
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
              status,
              category,
            } = req.body
            
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to add a product',
                    code: EErrors.DATABASE_ERROR
                })
            }

            await this.productService.addProduct(title, description, price, thumbnail, code, stock, status, category)
        
            res.json({
                status: 'success',
                message: 'Product added successfully',
            })
            } catch (error) {
              next(error)
              //res.status(500).send('Server error')
        }
    }

    updateProduct = async (req,res,next)=>{
        try{
            const pid = req.params.pid
            const {title, description, price, thumbnail, code, stock, status, category} = req.body
            if(!title || !price || !code || !stock){
                customError.createError({
                    name: 'Product to update error',
                    cause: generateProductErrorInfo({
                        title,
                        description,
                        price,
                        thumbnail,
                        code,
                        stock,
                        status,
                        category,
                    }),
                    message: 'Error trying to update a product',
                    code: EErrors.DATABASE_ERROR
                })
            }
            await this.productService.updateProduct(pid, title, description, price, thumbnail, code, stock, status, category)
            res.json({
                status: 'success',
                message: 'Producto agregado exitosamente',
            })
        }catch(error){
            next(error)
            //res.status(500).send('server error')
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            const pid = req.params.pid
            const userEmail = req.session.user.user

            const product = await this.productService.getProductById(pid)
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
            }

            if (req.session.user.role === 'admin' || product.owner === userEmail) {
                const deletedProduct = await this.productService.deleteProduct(pid)
                if (deletedProduct) {
                    return res.json({ status: 'success', message: 'Producto eliminado exitosamente' })
                }
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
            } else {
                return res.status(403).json({ status: 'error', message: 'No autorizado para borrar este producto' })
            }
        } catch (error) {
            next(error)
        }
    }


}

module.exports = ProdcutsController