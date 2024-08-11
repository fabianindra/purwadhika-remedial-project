import { serviceAddProduct, serviceGetProducts } from '@/services/product.service';
import { Request, Response } from 'express';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await serviceGetProducts({
      params: req.params,
      query: req.query,
    });
    return res.status(result.status).send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
    try {
      const result = await serviceAddProduct(req.body);
      return res.status(result.status).send(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: 500,
        success: false,
        message: 'Server error',
        error: (error as Error).message,
      });
    }
  };