import "reflect-metadata";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  JsonController,
  QueryParam,
  NotFoundError,
  BadRequestError,
} from "routing-controllers";
import { ProductDTO } from "../dto/Product";
import { MESSAGE_ERROR } from "../const/message-error.const";
import { ProductInterface } from "../interfaces/product.interface";
import { productStore } from "../data/productStore";

@JsonController("/products")
export class ProductController {
  
 @Get("")
  @Get("")
getAll(
  @QueryParam("page") page: number,
  @QueryParam("limit") limit: number
) {
  const currentPage = page && page > 0 ? page : 1;
  const pageSize = limit && limit > 0 ? limit : 10;

  
 const sortedProducts = [...productStore].sort((a, b) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);


  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = sortedProducts.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: totalItems,
    currentPage,
    totalPages,
  };
}



  @Get("/verification/:id")
  verifyIdentifier(@Param("id") id: number | string) {
    return productStore.some((product) => product.id === id);
  }

  @Get("/:id")
  getOne(@Param("id") id: number | string) {
    const index = this.findIndex(id);
    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }
    return productStore[index];
  }

  @Post("")
createItem(@Body({ validate: true }) productItem: ProductDTO) {
  const index = this.findIndex(productItem.id);
  if (index !== -1) {
    throw new BadRequestError(MESSAGE_ERROR.DuplicateIdentifier);
  }

  const productWithTimestamp = {
    ...productItem,
    createdAt: new Date().toISOString(),
  };

  productStore.push(productWithTimestamp);

  return {
    message: "Product added successfully",
    data: productWithTimestamp,
  };
}


  @Put("/:id")
  put(
    @Param("id") id: number | string,
    @Body() productItem: ProductInterface
  ) {
    const index = this.findIndex(id);
    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    productStore[index] = {
      ...productStore[index],
      ...productItem,
    };

    return {
      message: "Product updated successfully",
      data: productStore[index],
    };
  }

  @Delete("/:id")
  remove(@Param("id") id: number | string) {
    const index = this.findIndex(id);
    if (index === -1) {
      throw new NotFoundError(MESSAGE_ERROR.NotFound);
    }

    productStore.splice(index, 1);

    return {
      message: "Product removed successfully",
    };
  }

  private findIndex(id: number | string) {
    return productStore.findIndex((product) => product.id === id);
  }
}
