module main

import veb
import db.sqlite
import model
import json
import db

pub struct Context {
	veb.Context
pub mut:
	customer model.Customer
}

pub struct App {
pub:
	db sqlite.DB
}

// CUSTOMERS
@['/customer/show'; get]
fn (app &App) customer_show(mut ctx Context) veb.Result {
	customers := sql app.db {
		select from model.Customer
	} or { return ctx.json('{"status": "db_error"}') }

	return ctx.json(customers)
}

@['/customer/add'; post]
pub fn (app &App) customer_add(mut ctx Context) veb.Result {
	data := ctx.req.data
	customer_decode := json.decode(model.Customer, data) or {
		return ctx.json('{"status": "error"}')
	}
	new_customer := model.new_customer(customer_decode.customer, customer_decode.insta,
		customer_decode.phone, customer_decode.city, customer_decode.post)

	sql app.db {
		insert new_customer into model.Customer
	} or { return ctx.json('{"status_db": "error"}') }

	return ctx.json('{"status": "ok"}')
}

//  PRODUCTS
@['/product/show'; get]
fn (app &App) product_show(mut ctx Context) veb.Result {
	products := sql app.db {
		select from model.Product
	} or { return ctx.json('{"status": "db_error"}') }

	instocks := sql app.db {
		select from model.Instock
	} or { return ctx.json('{"status": "db_error"}') }

	// Собираем результат: для каждого продукта ищем остаток
	mut result := []map[string]string{}
	for product in products {
		// ищем остаток по product_id
		instock := instocks.filter(it.product_id == product.product_id)
		quantity := if instock.len > 0 { instock[0].quantity } else { '' }
		note := if instock.len > 0 { instock[0].note } else { '' }
		result << {
			'product_id': product.product_id.str()
			'product':    product.product
			'price':      product.price
			'quantity':   quantity
			'note':       note
		}
	}
	return ctx.json(result)
}

@['/product/add'; post]
pub fn (app &App) product_add(mut ctx Context) veb.Result {
	data := ctx.req.data
	product_decode := json.decode(model.Product, data) or { return ctx.json('{"status": "error"}') }
	instock_decode := json.decode(model.Instock, data) or { return ctx.json('{"status": "error"}') }

	new_product := model.new_product(product_decode.product, product_decode.price)
	new_instock := model.new_instock(new_product.product_id, instock_decode.quantity,
		instock_decode.note)

	sql app.db {
		insert new_product into model.Product
	} or { return ctx.json('{"status": "db_error"}') }
	sql app.db {
		insert new_instock into model.Instock
	} or { return ctx.json('{"status": "db_error"}') }

	return ctx.json('{"status": "ok"}')
}

// SALES
@['/sales/show'; get]
pub fn (app &App) sales_show(mut ctx Context) veb.Result {
	sales := sql app.db {
		select from model.Sale
	} or { return ctx.json('{"status": "db_error"}') }

	customers := sql app.db {
		select from model.Customer
	} or { return ctx.json('{"status": "db_error"}') }

	products := sql app.db {
		select from model.Product
	} or { return ctx.json('{"status": "db_error"}') }

	// Собираем результат: для каждой продажи ищем клиента и продукт
	mut result := []map[string]string{}
	for sale in sales {
		customer := customers.filter(it.customer_id == sale.customer_id)
		product := products.filter(it.product_id == sale.product_id)
		result << {
			'customer': if customer.len > 0 { customer[0].customer } else { '' }
			'product':  if product.len > 0 { product[0].product } else { '' }
			'quantity': sale.quantity
		}
	}

	return ctx.json(result)
}

@['/sales/add'; post]
pub fn (app &App) sales_add(mut ctx Context) veb.Result {
	data := ctx.req.data

	customer_decode := json.decode(model.Customer, data) or {
		return ctx.json('{"status": "error"}')
	}
	product_decode := json.decode(model.Product, data) or { return ctx.json('{"status": "error"}') }
	sale_decode := json.decode(model.Sale, data) or { return ctx.json('{"status": "error"}') }

	customer_sql := sql app.db {
		select from model.Customer where customer == customer_decode.customer
	} or { return ctx.json('{"status": "db_error"}') }
	product_sql := sql app.db {
		select from model.Product where product == product_decode.product
	} or { return ctx.json('{"status": "db_error"}') }

	println('product_sql: ${product_sql}')

	new_sale := model.new_sale(customer_sql[0].customer_id, product_sql[0].product_id,
		sale_decode.quantity, sale_decode.note)
		println(new_sale)
	sql app.db {
		insert new_sale into model.Sale
	} or { return ctx.json('{"status": "db_error"}') }


	instock_sql := sql app.db {
		select from model.Instock where product_id == product_sql[0].product_id
	} or { return ctx.json('{"status": "db_error"}') }
	println('instock_sql: ${instock_sql}')

	sql app.db {
    update model.Instock set quantity = quantity + sale_decode.quantity where product_id == product_sql[0].product_id
	} or { return ctx.json('{"status": "db_error"}') }

	return ctx.json('{"status": "ok"}')
}


fn main() {
	mut app := &App{
		db: db.connect_to_db()
	}

	veb.run[App, Context](mut app, 8080)
}

