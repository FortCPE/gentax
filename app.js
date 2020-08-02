const express = require('express')
var cors = require('cors')
const app = express()
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gentax"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("[Gentax] Connecting to Database...");
  console.log("[Gentax] Connected")
});
app.use(express.json())
app.use(cors())

// -------------------------------------------- เริ่ม API สินค้า --------------------------------------------------//
// การจัดการ STOCK API -----------------------------------------------------------------------------------------------------
//ทำการ GET ข้อมูล สินค้า ทั้งหมด
app.get('/api/stock/all', (req,res) => {
  var sql = "SELECT * FROM stocks JOIN types ON stocks.stock_type = types.type_id JOIN units ON stocks.stock_unit = units.unit_id";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ GET ข้อมูล สินค้า ทั้งหมด จาก ประเภทสินค้า
app.post('/api/stock/all_by_type', (req,res) => {
  var sql = "SELECT * FROM stocks JOIN types ON stocks.stock_type = types.type_id JOIN units ON stocks.stock_unit = units.unit_id WHERE stocks.stock_type = '"+ req.body.stock_type +"' ORDER BY RAND() LIMIT "+ req.body.stock_limit +"";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ GET ข้อมูล สินค้า ทั้งหมด จาก ประเภทสินค้า
app.post('/api/stock/all_type', (req,res) => {
  var sql = "SELECT * FROM stocks JOIN types ON stocks.stock_type = types.type_id JOIN units ON stocks.stock_unit = units.unit_id ORDER BY RAND() LIMIT "+ req.body.stock_limit +"";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

// ทำการเพิ่มสินค้า
app.post('/api/stock/insert', (req, res) => { 
  var checksql = "SELECT stock_id FROM stocks WHERE stock_name = '"+ req.body.stock_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
          console.log("[Gentax] Error, "+ req.body.stock_name +" is duplicated");
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "INSERT INTO stocks (stock_id, stock_name, stock_price, stock_type, stock_unit, stock_desc, added_by) VALUES (NULL, '"+ req.body.stock_name +"', '"+ req.body.stock_price +"', '"+ req.body.stock_type +"', '"+ req.body.stock_unit +"', '"+ req.body.stock_desc +"', '0')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Stock Record is Inserted");
          res.send("SUCCEDD|INSERTED")
        });
      }
  });
});

// ทำการแก้ไขข้อมูลชื่อสินค้า
app.post('/api/stock/manage/name', (req,res) => {
  var checkstock = "SELECT stock_id FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
  var query = con.query(checkstock, function(err, result) {
      if(result.length !== 1){
        res.send("ERROR|404")
      }else{
        var sql = "UPDATE stocks SET stock_name = '"+ req.body.stock_name +"' WHERE stock_id = '"+ req.body.stock_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Stock Record is Updated");
        });
      }
  });
})

// ทำการแก้ไขข้อมูลราคาสินค้า
app.post('/api/stock/manage/price', (req,res) => {
  var checkstock = "SELECT stock_id FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
  var query = con.query(checkstock, function(err, result) {
      if(result.length !== 1){
        res.send("ERROR|404")
      }else{
        var sql = "UPDATE stocks SET stock_price = "+ req.body.stock_price +" WHERE stock_id = '"+ req.body.stock_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Stock Record is Updated");
        });
      }
  });
})

// ทำการแก้ไขข้อมูลรายละเอียดสินค้า
app.post('/api/stock/manage/desc', (req,res) => {
  var checkstock = "SELECT stock_id FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
  var query = con.query(checkstock, function(err, result) {
      if(result.length !== 1){
        res.send("ERROR|404")
      }else{
        var sql = "UPDATE stocks SET stock_desc = '"+ req.body.stock_desc +"' WHERE stock_id = '"+ req.body.stock_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Stock Record is Updated");
        });
      }
  });
})

// ทำการแก้ไขข้อมูหน่วยสินค้า
app.post('/api/stock/manage/unit', (req,res) => {
  var checkstock = "SELECT stock_id FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
  var query = con.query(checkstock, function(err, result) {
      if(result.length !== 1){
        res.send("ERROR|404")
      }else{
        var sql = "UPDATE stocks SET stock_unit = "+ req.body.stock_unit +" WHERE stock_id = '"+ req.body.stock_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Stock Record is Updated");
        });
      }
  });
})

// ทำการแก้ไขข้อมูลประเภทสินค้า
app.post('/api/stock/manage/type', (req,res) => {
  var checkstock = "SELECT stock_id FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
  var query = con.query(checkstock, function(err, result) {
      if(result.length !== 1){
        res.send("ERROR|404")
      }else{
        var sql = "UPDATE stocks SET stock_type = "+ req.body.stock_type +" WHERE stock_id = '"+ req.body.stock_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Stock Record is Updated");
        });
      }
  });
})

// ทำการลบข้อมูลสินค้า
app.post('/api/stock/delete', (req,res) => {
  var checksql = "SELECT stock_id FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        var sql = "DELETE FROM stocks WHERE stock_id = '"+ req.body.stock_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Stock Record is Deleted");
          res.send("SUCCEED|DELETED")
        });
      }else{
        res.send("ERROR|404")
      }
  });
})
// สิ้นสุด STOCK API -----------------------------------------------------------------------------------------------------


// UNIT API -----------------------------------------------------------------------------------------------------

//ทำการ GET ข้อมูล หน่วย ทั้งหมด
app.get('/api/unit/all', (req,res) => {
  var sql = "SELECT * FROM units";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ GET ข้อมูล หน่วย ตามชื่อที่ต้องการ
app.get('/api/unit/name/:query', (req,res) => {
  var sql = "SELECT * FROM units WHERE unit_name LIKE '%"+ req.params.query +"%'";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ INSERT ข้อมูล หน่วย ที่ถูกส่งค่า POST มา
app.post('/api/unit/insert', (req, res) => {
  var checksql = "SELECT unit_id FROM units WHERE unit_name = '"+ req.body.unit_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        console.log("[Gentax] Error, "+ req.body.unit_name +" is duplicated");
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "INSERT INTO units (unit_id, unit_name, unit_desc, unit_added_by) VALUES (NULL, '"+ req.body.unit_name +"', '"+ req.body.unit_desc +"', '1')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Unit Record is Inserted");
          res.send("SUCCEDD|INSERTED")
        });
      }
  });
})

//ทำการ Update ข้อมูล ชื่อหน่วย ที่ถูกส่งค่า POST มา
app.post('/api/unit/manage/name', (req,res) => {
  var checksql = "SELECT unit_id,unit_name FROM units WHERE unit_name = '"+ req.body.unit_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE units SET unit_name = '"+ req.body.unit_name +"' WHERE unit_id = '"+ req.body.unit_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Unit Record is Updated");
        });
      }
  });
})


//ทำการ Update ข้อมูล รายละเอียดหน่วย ที่ถูกส่งค่า POST มา
app.post('/api/unit/manage/desc', (req,res) => {
  var checksql = "SELECT unit_id,unit_desc FROM units WHERE unit_desc = '"+ req.body.unit_desc +"' AND unit_id = '"+ req.body.unit_id +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE units SET unit_desc = '"+ req.body.unit_desc +"' WHERE unit_id = '"+ req.body.unit_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Unit Record is Updated");
        });
      }
  });
})


//ทำการ Delete ข้อมูล หน่วย ที่ถูกส่งค่า POST มา
app.post('/api/unit/delete', (req,res) => {
  var checksql = "SELECT unit_id FROM units WHERE unit_id = '"+ req.body.unit_id +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        var sql = "DELETE FROM units WHERE unit_id = '"+ req.body.unit_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Unit Record is Deleted");
          res.send("SUCCEED|DELETED")
        });
      }else{
        res.send("ERROR|404")
      }
  });
})
// สิ้นสุด UNIT API -----------------------------------------------------------------------------------------------------


// TYPE API -----------------------------------------------------------------------------------------------------

//ทำการ GET ข้อมูล ประเภท ทั้งหมด
app.get('/api/type/all', (req,res) => {
  var sql = "SELECT * FROM types";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ GET ข้อมูล ประเภท ตามชื่อที่ต้องการ
app.get('/api/type/name/:query', (req,res) => {
  var sql = "SELECT * FROM types WHERE type_name LIKE '%"+ req.params.query +"%'";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ INSERT ข้อมูล ประเภท ที่ถูกส่งค่า POST มา
app.post('/api/type/insert', (req, res) => {
  var checksql = "SELECT type_id FROM types WHERE type_name = '"+ req.body.type_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        console.log("[Gentax] Error, "+ req.body.type_name +" is duplicated");
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "INSERT INTO types (type_id, type_name, type_desc, type_added_by) VALUES (NULL, '"+ req.body.type_name +"', '"+ req.body.type_desc +"', '1')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Type Record is Inserted");
          res.send("SUCCEDD|INSERTED")
        });
      }
  });
})

//ทำการ Update ข้อมูล ชื่อประเภท ที่ถูกส่งค่า POST มา
app.post('/api/type/manage/name', (req,res) => {
  var checksql = "SELECT type_id,type_name FROM types WHERE type_name = '"+ req.body.type_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE types SET type_name = '"+ req.body.type_name +"' WHERE type_id = '"+ req.body.type_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Type Record is Updated");
        });
      }
  });
})


//ทำการ Update ข้อมูล รายละเอียดประเภท ที่ถูกส่งค่า POST มา
app.post('/api/type/manage/desc', (req,res) => {
  var checksql = "SELECT type_id,type_desc FROM types WHERE type_desc = '"+ req.body.type_desc +"' AND type_id = '"+ req.body.type_id +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE types SET type_desc = '"+ req.body.type_desc +"' WHERE type_id = '"+ req.body.type_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Type Record is Updated");
        });
      }
  });
})


//ทำการ Delete ข้อมูล ประเภท ที่ถูกส่งค่า POST มา
app.post('/api/type/delete', (req,res) => {
  var checksql = "SELECT type_id FROM types WHERE type_id = '"+ req.body.type_id +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        var sql = "DELETE FROM types WHERE type_id = '"+ req.body.type_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Type Record is Deleted");
          res.send("SUCCEED|DELETED")
        });
      }else{
        res.send("ERROR|404")
      }
  });
})

// -------------------------------------------- จบ API สินค้า --------------------------------------------------//


// -------------------------------------------- เริ่ม API บริษัท --------------------------------------------------//

//ทำการ GET ข้อมูล บริษัท ทั้งหมด
app.get('/api/business/all', (req,res) => {
  var sql = "SELECT * FROM businesses";
  var query = con.query(sql, function (err, result){
    if(result.length !== 0){
      res.send(result)
    }else if(result.length === 0){
      res.send("ERROR|EMPTYINFO")
    }
  })
})

//ทำการ INSERT ข้อมูล บริษัท ที่ถูกส่งค่า POST มา
app.post('/api/business/insert', (req, res) => {
  var checksql = "SELECT business_id FROM businesses WHERE business_name = '"+ req.body.business_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        console.log("[Gentax] Error, "+ req.body.business_name +" is duplicated");
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "INSERT INTO businesses (business_id, business_name, business_tax, business_address, business_invoice, business_added_by) VALUES (NULL, '"+ req.body.business_name +"', '"+ req.body.business_tax +"', '"+ req.body.business_address +"', '"+ req.body.business_invoice +"', '1')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Business Record is Inserted");
          res.send("SUCCEDD|INSERTED")
        });
      }
  });
})

//ทำการ Update ข้อมูล ชื่อบริษัท ที่ถูกส่งค่า POST มา
app.post('/api/business/manage/name', (req,res) => {
  var checksql = "SELECT business_id FROM businesses WHERE business_name = '"+ req.body.business_name +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE businesses SET business_name = '"+ req.body.business_name +"' WHERE business_id = '"+ req.body.business_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Business Record is Updated");
        });
      }
  });
})

//ทำการ Update ข้อมูล เลขภาษี ที่ถูกส่งค่า POST มา
app.post('/api/business/manage/tax', (req,res) => {
  var checksql = "SELECT business_id FROM businesses WHERE business_tax = '"+ req.body.business_tax +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE businesses SET business_tax = '"+ req.body.business_tax +"' WHERE business_id = '"+ req.body.business_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Business Record is Updated");
        });
      }
  });
})

//ทำการ Update ข้อมูล ที่อยู่ ที่ถูกส่งค่า POST มา
app.post('/api/business/manage/address', (req,res) => {
  var checksql = "SELECT business_id FROM businesses WHERE business_address = '"+ req.body.business_address +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE businesses SET business_address = '"+ req.body.business_address +"' WHERE business_id = '"+ req.body.business_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Business Record is Updated");
        });
      }
  });
})

//ทำการ Update ข้อมูล Invoice Number ที่ถูกส่งค่า POST มา
app.post('/api/business/manage/invoice', (req,res) => {
  var checksql = "SELECT business_id FROM businesses WHERE business_invoice = '"+ req.body.business_invoice +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        res.send("ERROR|DUPLICATED")
      }else{
        var sql = "UPDATE businesses SET business_invoice = '"+ req.body.business_invoice +"' WHERE business_id = '"+ req.body.business_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.send("SUCCEED|UPDATED")
          console.log("[Gentax] Success, 1 Business Record is Updated");
        });
      }
  });
})

// ทำการลบข้อมูลสินค้า
app.post('/api/business/delete', (req,res) => {
  var checksql = "SELECT business_id FROM businesses WHERE business_id = '"+ req.body.business_id +"'";
  var query = con.query(checksql, function(err, result) {
      if(result.length >= 1){
        var sql = "DELETE FROM businesses WHERE business_id = '"+ req.body.business_id +"'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("[Gentax] Success, 1 Business Record is Deleted");
          res.send("SUCCEED|DELETED")
        });
      }else{
        res.send("ERROR|404")
      }
  });
})
// -------------------------------------------- จบ API บริษัท --------------------------------------------------//
app.listen(3000, () => {
  console.log('[Gentax] Running Server...')
})