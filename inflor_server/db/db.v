module db

import db.sqlite
import model

pub fn connect_to_db() sqlite.DB {
	data := sqlite.connect('inflor_server/data/inflor.db') or {
		println('Error connecting to database: ${err}')
		return sqlite.DB{}
	}
	data.exec('PRAGMA foreign_keys = ON;') or { panic(err) }

	sql data {
		create table model.Customer
	} or { eprintln('Error creating table: ${err}') }

	sql data {
		create table model.Product
	} or { eprintln('Error creating table: ${err}') }

	sql data {
		create table model.Instock
	} or { eprintln('Error creating table: ${err}') }

	sql data {
		create table model.Sale
	} or { eprintln('Error creating table: ${err}') }

	return data
}
