1.sql schema
-Create Table ทีมี value ตามนี้
([pk]integer = serial)
  

  

  





2.Connect with database
ใน folder server จะมีไฟล์ .env ในไฟล์หน้าตาประมาณนี้


  

ด้านในแก้ตามนี้
PG_USER = "postgres"
PG_PASSWORD = "Your Password" ลบ your password แล้วใส่ pass database ของตัวเอง
PG_HOST =  "localhost"
PG_PORT = "5432"
PG_DB = "perntodo" //ใส่ชื่อ database ตัวเองหริอไม่ก็สร้าง db ชื่อนี้


PORT = 5000