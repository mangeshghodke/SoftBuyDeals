import { execSync } from 'child_process';

const products = [
  { id: "yqmj2ppg", title: "AGARO USB Type C to USB 3.0 OTG Cable", category: "Electronics" },
  { id: "afrjly5x", title: "GLUN® A4 Transparent Document File Folders with Button Closure", category: "Office Products" },
  { id: "44nnwx4l", title: "Amazon Brand Solimo 100% Virgin Plastic Hanging Planter", category: "Outdoor Living" },
  { id: "swtcsant", title: "Kamiliant by American Tourister Small Harrier Edge 8W 56 Cms Cabin (PP) Hard Sided 8 Wheels Spinner Luggage/Suitcase/Trolley Bag", category: "Bags, Wallets and Luggage" },
  { id: "cwmnpllh", title: "LifeKrafts Foldable Baby Mosquito Net for Bed", category: "Baby" },
  { id: "hhliajc6", title: "Amazon Basics - Multipurpose Slider Storage Bags", category: "Home & Kitchen" },
  { id: "h0tb0h3f", title: "FunBlast Party Drinking Glasses", category: "Home & Kitchen" },
  { id: "n6yyl4nq", title: "EUROWRAP Food Wrapping Paper 500g", category: "Home & Kitchen" },
  { id: "lj2f1ufk", title: "Stainless Steel Sink Corner Strainer Triangle Drainer Basket & Shelf Organizer", category: "Home Improvement" },
  { id: "c441sw0g", title: "Misamo Enterprise Microfiber Cleaning Cloth Roll", category: "Home Improvement" },
  { id: "kvxjzdu1", title: "AGARO Milk Frothing Pitcher – 350ml Stainless Steel Coffee Jug with Latte Art Pen", category: "Home & Kitchen" },
  { id: "w1msco6j", title: "Happer Premium Clothes Stand for Drying with Wheels", category: "Home & Kitchen" },
  { id: "omdek5ol", title: "OWNAIR Standing Iron Steamer For Clothes", category: "Irons, Steamers & Accessories" },
  { id: "nzbfy60j", title: "iBELL SM1515 Sandwich Maker with Floating Hinges", category: "Home & Kitchen" },
  { id: "ybdjytwv", title: "TEX-RO Kitchen Trolley with Wheels, 3-Layer Metal Vegetable Basket Stand & Kitchen Storage Rack", category: "Home & Kitchen" },
  { id: "ts8h0oyz", title: "Nutricook 5L Air Fryer", category: "Home & Kitchen Appliances" },
  { id: "dbp56815", title: "Plantex Premium 4 Step Steel Ladder", category: "Home Improvement" },
  { id: "5615qnpm", title: "Rechargeable Electric Gas Lighter for Kitchen, Lighter for Gas Stove", category: "Home & Kitchen" },
  { id: "79e83bfa-0dcc-478c-abe5-b69c80be9607", title: "Portable LED Flashlight COB Keychain Emergency Light", category: "Sports, Fitness & Outdoors" },
  { id: "c192c5b6-68c2-4c58-96e1-90430d3ed74c", title: "GRAYSON Gas Lighter For Kitchen", category: "Home & Kitchen" },
  { id: "d9e271f2-465d-4fa9-88c9-3ebeb9a6b5af", title: "Flying Goose Sriracha Hot Chilli Sauce", category: "Grocery & Gourmet Foods" },
  { id: "cb0781f2-70df-4135-b986-090e7753b977", title: "amazon basics Mild Steel Double Supported 3 Layer Cloth Drying Rack", category: "Home & Kitchen" },
  { id: "f84196ea-d431-4aed-8924-2194c637441f", title: "Puma Unisex Adult Geo Slide", category: "Shoes & Handbags" },
  { id: "e1218dbb-2f81-4a82-b488-9781ec86e399", title: "INOVERA Lazy Susan 360° Rotating Kitchen Spice Cosmetic Holder Organizer Rack Tray", category: "Home & Kitchen" },
  { id: "0498592b-6fe1-4f39-97c3-93ad7052f6ae", title: "Amazon Brand - Symbol Women Baggy Wide Leg Jeans", category: "Clothing & Accessories" },
  { id: "b1dbbb0a-9761-410a-a411-8ea0acd21566", title: "Playpen for Baby up to 5 Years Playards with Pit Balls and Anti-Fall Grasp Rings, Kids Activity Center with Safety Lock", category: "Baby" },
  { id: "0684221e-48ea-4577-bc86-e7ecbb3a9c94", title: "HELLCAT Trendy Printed Oversized Fit Crew-Neck Crop", category: "Clothing & Accessories" },
  { id: "2d780724-e649-4577-824b-3a2ce5bb08b9", title: "London Hills Oversized Tshirt for Woman", category: "Clothing & Accessories" },
  { id: "221d68f2-d2cc-4255-8053-ea6894bd7928", title: "London Hills Oversized Tshirt for Woman", category: "Clothing & Accessories" },
  { id: "4945dbc9-2485-4865-b145-4f599c398986", title: "Lifelong Cuppy Dancing Cactus Toy for Kids", category: "Toys & Games" },
  { id: "e47fc14a-7f55-4e7e-932b-de3e67446f91", title: "Storio 5-in-1 Baby Suction Spinner Toy, Interactive Learning Set with Rattle and Sensory Play", category: "Toys & Games" },
  { id: "f0a72772-d6ec-4e36-aec2-cb6295ac4c6d", title: "ATHCO Mens Drift Memory Foam Comfort Shoes", category: "Shoes" },
  { id: "94741f66-45f9-40c0-8d90-ddbb01c39d1b", title: "Homesake 6 Watt, 3 in 1 Multicolor Led Bulb", category: "Light Bulbs" },
  { id: "94913cf8-680e-44c7-8bc9-b958eae116b9", title: "SWAGR 12 Pairs Solid Cotton Ankle Length Socks for Men Women, Pack of 12", category: "Clothing & Accessories" },
  { id: "5829b3ed-6682-4def-8d31-b4e0994a829e", title: "The Indus Valley Super Smooth Cast Iron Tawa+Silicone Handle for Dosa", category: "Home & Kitchen" },
  { id: "cb6bbd35-7f0d-43bf-8f1c-528c95cc9f2f", title: "The Indus Valley Stainless Steel 2.5ltr Strainer Pot/Rice Pot", category: "Home & Kitchen" },
  { id: "3b9415c6-ce9e-4ffa-8be5-1325d87ba120", title: "Tribit XSound Plus 2 30W 5.3 Bluetooth Wireless Speakers", category: "Electronics" },
  { id: "7461e22c-ffd2-4a4a-8a5a-a9675688e38d", title: "Wooum Water-Resistant Sling Bag for Men", category: "Bags, Wallets and Luggage" },
  { id: "1a5fd7b1-bf26-4042-a712-9d5c4cf82890", title: "Puma Unisex-Adult Court Curves Sneaker", category: "Shoes & Handbags" },
  { id: "029fe3bf-f244-4a37-87cc-8b7a6b6d3f64", title: "Wooum Passport Holder for Family, Passport Case Protection, Water Resistant Passport Bag for Men & Women", category: "Bags, Wallets and Luggage" },
  { id: "3209f5d6-63ea-4938-81b1-b90f77ce2cbc", title: "Storite 3 Pack Moisture Proof Nylon Underbed Storage Bag For Clothes", category: "Under-Bed Storage" },
  { id: "522ec5f4-dbbb-459e-9cc8-1ebb08010470", title: "URBAN FOREST Seattle Green/Sand Leather Wallet", category: "Bags, Wallets and Luggage" },
  { id: "19cf989f-5a2b-4d1c-ba26-8b6355c0c480", title: "Plantex Steel 5 Step Ladder for Home/Wide Anti Skid 5 Step Ladder Foldable", category: "Ladders" },
  { id: "bd577e32-2857-4551-b6bc-e53910ac36f0", title: "Multifunctional Washing Vegetables and Fruit Draining Basket", category: "Home & Kitchen" },
  { id: "1365ca33-5407-46f3-8b9b-77e413cf4bf5", title: "ROYALSCOUT Men's Cotton Polyester Blend Solid Regular Fit Full Sleeve Short Kurta", category: "Clothing & Accessories" },
  { id: "a73fb687-0fae-4a79-9f38-6e55a64f1d21", title: "CLEANERS Sound Keychain – CUTE & FUNNY Croaking Battery Frog Key Ring for Kids", category: "Bags, Wallets and Luggage" },
  { id: "cbc50b34-707f-460a-8ab6-1e985e0fef68", title: "WallDesign Magnetic Whiteboard Sheet 23x30cm – Dry Erase Fridge Memo Board", category: "Magnetic Boards" },
  { id: "25c4fa9d-f040-41db-be5a-2f0a77159658", title: "3 Lines Acrylic Magnetic Shopping List Notepad for Fridge", category: "Magnetic Boards" },
  { id: "9cc707cd-1a64-4535-a57b-7dd0a602a67d", title: "Ant Esports Lapi MousePad 260X210X3mm", category: "Computers & Accessories" },
  { id: "dec490e9-d81d-42a6-a2cf-4c4b64a88156", title: "Storio Montessori Talking Flash Cards for Kids 2-5 Years", category: "Toys & Games" },
  { id: "fff745af-f70d-4f51-85d4-e45ee7ec826b", title: "Philips India's No.1 Hair Styling Brand -Hair Dryer", category: "Hair Dryers" },
  { id: "513e4a6f-619d-40c7-a11f-ff542c4ff30e", title: "realme Buds Wireless 3 Neo in Ear Bluetooth Neckband", category: "Electronics" },
  { id: "0ef86fd8-4848-44c1-9cde-88eebf1cfb8a", title: "Sounce Mouse Pad, Ergonomic Mouse Pad with Comfortable Gel Wrist Rest Support", category: "Computers & Accessories" },
  { id: "76bb4a61-599a-4e75-bca3-29f93b6adf35", title: "IFTEX Clean System D with Triple Action Diesel Additive for All Diesel Cars (Pack of 2)", category: "Car & Motorbike" },
  { id: "542fa6e3-5ee8-4dad-ad73-4befaf7009b3", title: "IFTEX Clean System G Petrol Additive for All Petrol Cars (400 ml)", category: "Car & Motorbike" },
  { id: "fe85448b-da4c-4cea-aa02-1306f6c17f0e", title: "ARISTO Multipurpose Plastic Storage Container Box with Wheels", category: "Home Storage & Organisation" },
  { id: "b61c846d-406e-4c47-8a4a-da589f67d2c4", title: "IFTEX Clean System 2/3 e20 Petrol Additive for Bike/Scooters 200 ml", category: "Car & Motorbike" },
  { id: "7dc4f2fa-2a0d-4be1-a377-bc0f9e6ebcfd", title: "IFTEX Clean System G for All Petrol Cars (200 ml)", category: "Car & Motorbike" },
  { id: "8e06adf2-7e3d-4979-b469-b648b11773b8", title: "Cetaphil Cleansing Moisturizing Syndet Bar", category: "Beauty" },
  { id: "2b9a3326-1b3e-47cc-9eec-bc7d6ed0cba1", title: "Cookwell Bullet Mixer Grinder", category: "Home & Kitchen" },
  { id: "685410c6-a37f-43d7-9316-f1ad0792c429", title: "Water Bottle 1 ltr Stainless Steel Sports/Fridge Bottle with Sipper Cap", category: "Home & Kitchen" },
  { id: "24359d34-d1dd-4355-b002-f260d6e52c33", title: "Necavu 100% cotton set of 6 fridge bag | Eco-friendly natural vegetables bags for fridge storage", category: "Home & Kitchen" },
  { id: "9cc11756-34b6-4ca5-a049-727164314577", title: "Butterfly Premium Vegetable Chopper", category: "Home & Kitchen" },
  { id: "2d597424-88f6-4335-9332-55ff3107e5e0", title: "Borosil Chef Delite 300 Watts Electric Chopper for Kitchen", category: "Home & Kitchen Appliances" },
  { id: "7a4fef32-87b3-45e3-aad4-bfa12466cf37", title: "Skybags Streax Cabin Trolley Bag, 55 Cm, Small Hardside Luggage 8 Wheels Spinner", category: "Bags, Wallets and Luggage" },
  { id: "376806c9-c364-4a0b-b9e8-a8f255357efd", title: "Portronics MODESK Universal Mobile Holder Stand with Metal Body", category: "Electronics" },
  { id: "a4778617-fc2b-42d2-8482-f62bca56d00f", title: "ZORO Cotton D ring buckle belt for men", category: "Clothing & Accessories" },
  { id: "b129836c-9e01-4a90-af71-514ada2e9b87", title: "Goldmedal G-Shell Door Bell | Wired Electronic Door Chime", category: "Home Improvement" },
  { id: "7d6d5094-684d-4a97-a727-3958519e8cae", title: "JBL Charge 6, Powerful Pro Sound with AI Sound Boost Wireless Portable Bluetooth Speaker", category: "Electronics" },
  { id: "024054be-904a-42d9-b6ad-5c633a05e7d0", title: "Amazon Brand - Presto! Garbage Bags, Medium 180 Count", category: "Dustbin Bags" },
  { id: "c9e2a52c-aa9a-430c-b42a-a514a122254e", title: "Boat Rockerz 113, 40H Battery, Dual Pair, Fast Charge, ENx Tech", category: "Electronics" },
  { id: "964d7915-ecb8-4a45-b443-c6e6253e41ca", title: "CINAGRO Cycle-Shaped Metal Flower Planter Pot", category: "Outdoor Décor" },
  { id: "1ae7858a-49a7-43cb-8de3-6d3c2d41df49", title: "Lifelong Shoe Bags for Travel, Drawstring Travel Shoe Bags", category: "Shoe Bags" },
  { id: "db154fc3-0108-4f12-adff-8bc609801261", title: "DALUCI Shoe Bag for Travel Pack of 6", category: "Shoe Bags" },
  { id: "ed24d120-294f-4ddb-90a9-4ba5bddaf5c2", title: "Umbrella for Men & Women Rain Fully Automatic, Windproof Ribs, Foldable", category: "Umbrellas" },
  { id: "8f553d76-c45c-4527-80d0-38a8c8fc01e3", title: "PETRICE Travel Organizer Pouch Packing Cubes for Travel", category: "Bags, Wallets and Luggage" },
  { id: "908290f0-91c2-412d-bd1a-2ca3110cc09a", title: "Boat Stone 352 Pro/Stone 358 Pro w/ 14W Signature Sound", category: "Electronics" },
  { id: "7d617d1e-993f-4ad6-85a2-97836a272907", title: "Boat Rockerz 411, 40Ms Low Latency, 40Hrs Battery, 40Mm Drivers", category: "Electronics" },
  { id: "3539002a-4c9a-419a-9014-97b6ac52172e", title: "Duracell Alkaline AA Battery, Pack of 20", category: "Electronics" },
  { id: "3950346b-d5a8-4bba-aafd-9139aa6191ec", title: "JBL New Live 780NC, Advanced Noise Cancellation 2.0 Wireless Headphones", category: "Electronics" },
  { id: "4b9a2a06-b20a-4ca1-95e6-644c1b01c60f", title: "Dyazo 15.6 Inch Laptop Sleeve with Charger Pouch", category: "Computers & Accessories" },
  { id: "579a787b-e63b-4d11-9881-1c0a0347b119", title: "AGARO Elite Rechargeable Mini Electric Chopper, Food Grade Bowl", category: "Home & Kitchen" },
  { id: "d6c9de32-8302-4ea1-90a9-34c1528f9b3f", title: "Klosia Women Pure Cotton Kurta Palazzo Set", category: "Clothing & Accessories" },
  { id: "44e0e78c-dcfe-4ffa-a5d7-69312e8bf51a", title: "Pinkmint Women's Cotton Blend Sleeveless Kurta Pant Set with Silk Dupatta", category: "Clothing & Accessories" },
  { id: "c0d2cef2-6dbc-407e-9b05-e2116ce3dac3", title: "KLOSIA Women Embroidery Solid Anarkali Kurta and Pant Set", category: "Clothing & Accessories" },
  { id: "be7f0093-6034-4577-bb62-4ab694b36c76", title: "blue tree Cute Kids Backpack Toddler Bag Plush Animal Cartoon Mini Travel Bag", category: "Toys" },
  { id: "11acb4ed-67f8-45c5-b24e-4967e0e508e0", title: "rts New Imported RFID Protected 9 Slot Men's Wallets", category: "Bags, Wallets and Luggage" },
  { id: "354d37e6-9bc4-4ade-89e0-868e9a0d085c", title: "Shoetopia Women Loafers", category: "Shoes & Handbags" },
  { id: "646b95b0-2316-4254-91e7-1decebd758fb", title: "AUSK Oversized T-Shirt for Womens", category: "Clothing & Accessories" },
  { id: "28f53bef-bd3c-4b10-b7c5-c62651f9cde2", title: "Sony WH-CH720N Active Noise Cancellation Wireless Bluetooth Over Ear Headphones with Mic", category: "Electronics" },
  { id: "aa464b30-2dfe-4a8d-893c-2af6d0f90baa", title: "PHILIPS Air Fryer NA231/00 with touch panel", category: "Home & Kitchen" },
  { id: "02426210-f0ea-477e-a8f6-9c6df39e0902", title: "Xiaomi 108 cm (43 inch) FX Pro QLED Ultra HD 4K Smart Fire TV", category: "Electronics" },
  { id: "aedc8f89-4a1f-4c34-b7c1-f97ee02c791b", title: "Crompton Galaxy Decoration Copper USB Powered String Fairy Lights with 100 Led", category: "Electronics" },
  { id: "aee93300-4291-4d06-82e4-2c4cca6d487e", title: "SanDisk Ultra 128GB microSDXC UHS-I, 140MB/s R, Memory Card", category: "Electronics" },
  { id: "f658da78-3da5-4740-ac96-18cd377ab267", title: "70mai A510 HDR 3K Dual Channel Dash Cam, STARVIS 2 IMX675 Sensor", category: "Electronics" },
  { id: "7aaa779f-cbe2-470f-9711-871143acc068", title: "Oppo Enco Air 5 True Wireless Noise Cancelling Earbuds with 52dB Real time ANC", category: "Electronics" },
  { id: "cd85d749-a062-4628-a478-757432fd5f78", title: "OnePlus Nord Buds 4 Pro TWS Earbuds, Upto 55dB Real-time ANC", category: "Electronics" },
  { id: "44f16baa-15c9-42bd-8b96-976a8ab834a1", title: "Sony WH-1000XM5 Best Active Noise Cancelling Wireless Bluetooth Over Ear Headphones", category: "Electronics" },
  { id: "ccffabca-cf9a-41f0-b87c-011c2aeff951", title: "PRANIJ 3-Fold Compact Travel Golf Umbrella with Carabiner Handle", category: "Bags, Wallets and Luggage" },
  { id: "15eab187-c381-4964-aa24-2ccd5ef7b975", title: "Sony ULT Wear WH-ULT900N Noise Cancellation Wireless Bluetooth Over Ear Headphones", category: "Electronics" },
  { id: "ba1c14b5-daca-409b-94dd-c6c33f0aea4f", title: "Amazon Brand - Vedaka Cane Jaggery Powder | 1 Kg Jar", category: "Grocery & Gourmet Foods" },
  { id: "6fd04f5f-b1fe-479a-94f9-b24ebdeef931", title: "Ambrane 20000mAh Small Pocket Size Powerbank", category: "Electronics" },
  { id: "df0ce962-189d-4ba8-b550-6c47f03f303c", title: "Borosil Classic Glass Jar, Air-Tight Storage Container For Kitchen", category: "Home & Kitchen" },
  { id: "0b5dcb45-2cfd-4203-9413-29b775d6cfdd", title: "OnePlus Nord Buds 3r TWS Earbuds up to 54 Hours Playback", category: "Electronics" },
  { id: "e3e4ea5d-5207-49b4-a0ac-29bc8cf294b8", title: "Portronics Bubble 3.0 Wireless Keyboard with Bluetooth + 2.4 GHz USB Receiver", category: "Electronics" },
  { id: "5c118af0-196d-444f-8b6a-13b84592c679", title: "Gesto Portable Fan Rechargeable with LED Light – Foldable Mini Fan", category: "Electronics" },
  { id: "9ca76842-4cd0-4c92-bf04-a0b19932c248", title: "Baby Dove Rich Moisture Hair To Toe Baby Wash", category: "Baby Care" },
  { id: "70c89955-9189-461a-ba67-b6f9cfcadb3c", title: "Bella Vita Luxury Date Woman", category: "Beauty" },
  { id: "ae0d5385-2720-4a7a-8234-efaa04ce7f0a", title: "Ambrane Multipurpose Tabletop Mobile Stand", category: "Electronics" },
  { id: "8eedc15a-7f11-4807-aa9c-57be3e25e526", title: "Aristocrat Comet 8 Wheel Check-in (Medium Size) Hard Case Trolley Bag", category: "Bags, Wallets and Luggage" },
  { id: "e6051f2f-eaaf-4180-a8e3-73fb4667df47", title: "Portronics Konnect X 60W Unbreakable Nylon Braided Cable, 2M Fast Charging Cable", category: "Electronics" },
  { id: "8aae1a80-872c-4859-9a96-a5be8397b057", title: "Portronics 80W Dual Output Fast Car Charger with Type-C PD & USB", category: "Electronics" },
  { id: "11370cb1-b1af-4358-9288-c994c4207724", title: "HAMMER Unbreakable Type C to Type C Cable 60W Braided, PD Fast Charging", category: "Electronics" },
  { id: "2fcedd2c-8ca8-4915-a3e0-d795a6dc9309", title: "Amazon Echo Pop| Smart speaker with Alexa and Bluetooth|", category: "Electronics" },
  { id: "ddd6f91e-de51-4a06-b926-a449b58803a7", title: "Arctic Fox Pureview Transparent Wireless and Bluetooth Rechargeable Mouse", category: "Electronics" },
  { id: "81acc14e-5673-4bcc-8f63-603ca18dd2ad", title: "Portronics Bridge X USB 3.0 Type C Female to USB Male OTG Adapter", category: "Electronics" },
  { id: "5e4336f6-1861-4bdb-be38-a6a8ee5ac048", title: "Portronics Conch Theta C in Ear Type C Wired Earphones with in Line HD Mic", category: "Electronics" },
  { id: "75808b08-6fbd-42e1-b477-2557eafecc52", title: "Samsung Galaxy Buds Core", category: "Electronics" },
  { id: "f6ceda8b-e215-4304-9cef-44848cfc4f09", title: "Amazon Echo Dot (5th Gen)", category: "Electronics" },
  { id: "2a34ca5c-7690-4f13-b90e-2502b6f359f9", title: "All-new Amazon Echo Dot Max, Alexa speaker with 3X bass and room-filling sound", category: "Electronics" },
  { id: "8be1c85b-ef8b-4201-8b2b-e52c8909a221", title: "Happi Planet Kitchen Cleaner", category: "Health & Personal Care" },
  { id: "e1fd14f2-99a9-4050-aed8-95c131431629", title: "AKHILAM Women's Shimmer Organza Sequence Embroidery Saree With Unstitched Blouse", category: "Clothing & Accessories" },
  { id: "5d41225c-94f9-4978-b2f4-228f27ddd70b", title: "DOCTOR HEALTH SUPER SOFT Women's Orthopedic Soft Platform Slippers", category: "Women's Shoes" },
  { id: "1abbe45d-d0cc-40bb-a90c-bbebcf310fa9", title: "DOCTOR EXTRA SOFT Doctor Slippers for Women Orthopedic", category: "Women's Shoes" },
  { id: "4488c2a6-61d5-4f2f-bd87-0d86f5042c69", title: "Kraft Seeds Home Tools, 7Pcs Gardening Tools Kit for Home Garden", category: "Gardening" },
  { id: "babcbcd9-6762-4701-b79d-838636e1880e", title: "4-Piece Gardening Tools Kit for Home", category: "Gardening" },
  { id: "3d16a4c3-e6d8-4746-aed9-316164c50f2a", title: "Amazon Basics Self Adhesive Towel Rod for Bathroom No Drill", category: "Bathroom Hardware" },
  { id: "3d72ce60-a3d9-4fb5-bc47-6993cdd7fb2e", title: "Gala Sponge Wipe for Kitchen", category: "Home Improvement" },
  { id: "1c9974be-d1b0-43cf-ae1f-acf378178b43", title: "Louis Luxe Womens Korean Night Dress Round Neck Short Sleeve", category: "Clothing & Accessories" },
  { id: "ba0aa5bc-53df-48a4-952e-4a049f707390", title: "AASK Dress, One Piece, Kurta Set and Tops", category: "Clothing & Accessories" },
  { id: "ddf2538f-e7f7-4d79-9e29-abf2130ede62", title: "GRECIILOOKS Maxi Dress for Women Long One Piece Outfit", category: "Clothing & Accessories" },
  { id: "3b57db91-d2c6-4ee3-b769-9737f0c557ce", title: "Happer Premium Wooden Ironing Board/Table with Iron Holder", category: "Home & Kitchen" },
  { id: "90338a6b-5f36-493b-a0f1-e8f16f891b59", title: "Opullo Mother's Choice Sugar Tea Container Set Stainless Steel", category: "Home & Kitchen" },
  { id: "fc0bbd6c-006a-4d13-8be6-2c8478f97d28", title: "Birch & Co. Kitchen Containers Set - Tea Sugar Container Storage Set of 3", category: "Home & Kitchen" },
  { id: "f8d35b24-7bf3-4c7e-9f78-49031cce3f67", title: "Ponds Hydra Miracle Super Light Gel with Hyaluronic Acid & Vitamin C", category: "Beauty" },
  { id: "3f0a625a-d1f6-489a-ab2c-e3b0b9046cca", title: "Yashika Women's Organza Saree with Blouse Piece", category: "Clothing & Accessories" },
  { id: "66d8af0b-4cdb-4d63-bdcd-6b62ffc284b6", title: "MIRCHI FASHION Women Saree Chiffon Flower Print", category: "Clothing & Accessories" },
  { id: "f97642f0-6fdc-4175-8a52-517066ab15dd", title: "London Hills Women's Cotton Oversized Fit Printed Round Neck Oversized T-Shirt Pack of 3", category: "Clothing & Accessories" },
  { id: "badd4cff-f227-4c42-86fc-d5175e2dc70c", title: "Heavy Quality Multipurpose Plastic Big Revolving Spice Rack 16 in 1 Masala Rack Set", category: "Home & Kitchen" },
  { id: "c5b1b00c-c3d7-4e7c-b432-2df52cf2552c", title: "Sheesham Wood Dining Table 4 Seater Table with Chair", category: "Home & Kitchen" },
  { id: "a57ee472-5dbe-4520-bbcc-87434846c3da", title: "CRAE SF-400 Digital Kitchen Weighing Scale", category: "Home & Kitchen Appliances" },
  { id: "76f212ad-e0af-4e21-a699-cc44ee9fef5c", title: "Xariya Oil and Vinegar Dispenser Bottle for Kitchen", category: "Home & Kitchen" },
  { id: "f05863b1-a377-453e-a740-9a4d47a322ae", title: "Juicer For Home Tekcool Portable Juicer Machine", category: "Home & Kitchen Appliances" },
  { id: "755b162f-ecd3-4bb9-9024-1aae6869a706", title: "Pepe Jeans Men Jeans", category: "Clothing & Accessories" },
  { id: "2948cda2-a037-451f-9cf0-2ca1400be6fa", title: "Amazon Fire TV Stick 4K Plus (newest model)", category: "Electronics" },
  { id: "734e75ff-8980-40c7-a33b-1783f9e2bd2a", title: "Amazon Fire TV Stick HD (newest model)", category: "Electronics" },
  { id: "f314ca73-3bb6-4e0e-bddf-e62da0b8d95a", title: "Mr Muscle Kitchen Cleaner", category: "Household Supplies" },
  { id: "6281dc0b-d358-43b6-b669-4f18c28ca592", title: "Amazon Brand - Presto! Non-Woven Kitchen Towel Roll", category: "Home & Kitchen Appliances" },
  { id: "f51262f9-4246-4ad5-b89d-841900b47e3a", title: "Shasmi Girl's & Women's Solid Color V-Neck A-Line Maxi Dress for Women", category: "Clothing & Accessories" },
  { id: "26e2b418-d985-4161-96f6-081112ea40b6", title: "Xiran 6 Fridge Storage Boxes Fridge Organizer", category: "Home & Kitchen Appliances" },
  { id: "d110def4-27f7-4af1-a4e7-7f00e9c9145b", title: "AGARO Atom Plus Electric Handheld Full Body Massager, 4 Massage Heads", category: "Health & Personal Care" },
  { id: "33d0e080-302c-49d3-b7d2-8adf3fd1237d", title: "ZENEME Gold Plated and American Diamond Heart Shape Mangalsutra With Earrings", category: "Jewellery" },
  { id: "6e9c2f50-e750-4dd5-832f-5c734a095e6c", title: "PVC Makeup Bag Travel Toiletries Organizer Cosmetic Bags", category: "Beauty" },
  { id: "6b39bf2a-e692-4f13-8c1a-099244b97b79", title: "HOKIPO over The Cabinet Door Kitchen Napkin and Paper Towel Holder", category: "Home & Kitchen Appliances" },
  { id: "928f3c5f-750b-4c28-9d15-5d407dd31bc2", title: "MATIC HOUSEWARE Air Tight Containers Storage Set For Kitchen", category: "Home & Kitchen Appliances" },
  { id: "f91563c6-0cf3-454c-a325-794799ee7b65", title: "One Plus Fast 100W Original USB Type C Data Sync Fast Charging Cable", category: "Computers & Accessories" },
  { id: "cca3a40f-e7c1-4ae3-afab-24cafb267596", title: "Kitchen Tap Spray Head with Button Control, Rotating Faucet Nozzle Attachment", category: "Home Improvement" },
  { id: "67002a67-bda3-41e2-bdd3-c7a9d11f578c", title: "Dargoba Broom Holder Wall Mounted", category: "Home & Kitchen" },
  { id: "bb92df04-fe5e-4c33-a778-69fb763e80a6", title: "Portronics Twin Cool Dual Head Portable USB Powered Fan", category: "Computers & Accessories" },
  { id: "ef3c3efe-e172-4c2e-a221-c0aba94b000d", title: "Lenovo LOQ 2024 12th Gen Core i5-12450HX NVIDIA RTX 3050 6GB Gaming Laptop", category: "Computers & Accessories" },
  { id: "4cdccfc0-de5a-4e22-a6ff-d36b7b3d800a", title: "SOFTSPUN Microfiber Cloth - 4 pcs - 40x40 cms - 340 GSM Grey", category: "Car & Motorbike" },
  { id: "a08c670d-e343-4933-9c27-91b1fd315877", title: "Women's Georgette Chevron Printed Anarkali Maxi Dress", category: "Clothing & Accessories" },
  { id: "022ffb86-bec7-4a59-9197-83b5a97587d0", title: "RIOMAX Stainless Steel Drill Free Self-Adhesive Paper Roll Holder", category: "Home & Kitchen" },
  { id: "ca82eb46-cd8d-40aa-b72d-c0cc0fc0f269", title: "Ambrane Extension Board, 4 Type C, 2 USB, 5 International Power Sockets", category: "Electronics" },
  { id: "d40dd57d-7d73-45bc-9d4a-9966e65dd95c", title: "Acer PowerHub Core GaN 3 AC Outlets + 4 USB Ports", category: "Electronics" },
  { id: "7879fb27-a11b-45a5-bf91-7f3480fdc800", title: "GM 6-in-1 PD Power Strip Extension Board with USB Port", category: "Electronics" },
  { id: "022d8eb9-bf54-4242-908c-2d5dc6dc6676", title: "Spigen ArcDock 4-in-1 3.2 Gen 1, Type-C Hub with Multi Port", category: "Electronics" },
  { id: "ada0c7f9-3c0b-4dda-9b28-cb398084417b", title: "Portronics Mport One USB C Hub Dock (9-in-1) with 4K 60Hz HDMI", category: "Electronics" },
  { id: "9d0fabad-06e3-4591-a390-46de8a608ab9", title: "Amazon Basics USB Type-C Hub Dock, 8-in-1 HDCP Aluminium Adapter", category: "Electronics" },
];

const reviews = {};

// Electronics
reviews["yqmj2ppg"] = "This little cable is super handy if you want to connect a pendrive or mouse to your phone. Works perfectly, no lag, and the price is too good. I keep one in my bag always.";
reviews["afrjly5x"] = "These folders are great for keeping school or office papers organised. The transparent cover helps you find things without opening every file. Button closure keeps everything secure. Good buy for the price.";
reviews["44nnwx4l"] = "If you love plants but don't have much floor space, these hanging planters are perfect. They look nice on the balcony and the plastic quality is decent. Plants are growing well in them.";
reviews["swtcsant"] = "Perfect size for short trips. Fits easily in overhead bins and the 8 wheels make it glide smoothly. The lock gives peace of mind. Colour looks just like the picture. Great value for money.";
reviews["cwmnpllh"] = "Must-have if you have a baby at home. Folds easily, no assembly needed. The mesh is fine enough to keep mosquitoes out but air flows freely. My baby sleeps peacefully without any bites.";
reviews["hhliajc6"] = "These storage bags are very useful for travel or storing clothes at home. The slider works smoothly and the bags are reusable. I use them for packing clothes separately in my suitcase.";
reviews["h0tb0h3f"] = "Good quality plastic glasses for parties. 20 pieces in one pack is great value. They look decent and are reusable. We used them for a birthday party and they worked perfectly fine.";
reviews["n6yyl4nq"] = "Good quality butter paper for everyday kitchen use. Works well for packing rotis and snacks. Doesn't tear easily and keeps food fresh. Good value for the quantity you get.";
reviews["lj2f1ufk"] = "This corner strainer perfectly fits in my sink and doesn't take up counter space. Good for keeping sponges and soap. The stainless steel feels sturdy and doesn't rust. Worth buying.";
reviews["c441sw0g"] = "These microfiber cloths are perfect for cleaning around the house. They absorb water well and don't leave lint behind. The roll format is convenient - just tear off what you need. Good for kitchen and car.";
reviews["kvxjzdu1"] = "If you're into making coffee at home, this pitcher is a good buy. The steel quality is nice, it doesn't feel cheap. The measurement marks help get the right amount of milk. The latte art pen is a bonus.";
reviews["w1msco6j"] = "This drying stand is very useful for families. Easy to move around on wheels and holds a lot of clothes. The coating doesn't rust and it folds when not needed. Better than those cheap plastic ones.";
reviews["omdek5ol"] = "If you have a lot of traditional or delicate clothes that need steaming, this is worth the money. Heats up fast and the steam is powerful. No more burns on expensive sarees. The touch screen feels modern.";
reviews["nzbfy60j"] = "Makes perfect sandwiches in minutes. The floating hinge design ensures even cooking. Non-stick plates make cleaning easy. Good for quick breakfast or evening snacks.";
reviews["ybdjytwv"] = "Very useful for keeping vegetables organised. The three tiers give plenty of storage and the wheels make it easy to move around. Metal construction feels strong. My kitchen looks much cleaner now.";
reviews["ts8h0oyz"] = "This air fryer has made cooking so much easier. The presets work well for all basic things. Food comes out crispy without much oil. Family of 4, the 5L size is just right.";
reviews["dbp56815"] = "Good quality ladder for home use. Feels very sturdy and the wide steps give confidence while climbing. The powder coating is smooth. Folds compact for storage. Better than aluminium ones that bend.";
reviews["5615qnpm"] = "Better than those old-style lighters that need gas refill. Just charge it with USB and it works. The flexible neck is useful for reaching deep burners. Safe and easy to use.";
reviews["79e83bfa-0dcc-478c-abe5-b69c80be9607"] = "This keychain light is surprisingly bright for its size. The built-in tools like screwdriver and bottle opener make it useful for emergencies. Good for keeping in the car or bag. The red light mode is helpful.";
reviews["c192c5b6-68c2-4c58-96e1-90430d3ed74c"] = "Works well for lighting the gas stove. The jet flame is strong and reliable. Refilling is easy. Much better than spending money on disposable lighters again and again.";
reviews["d9e271f2-465d-4fa9-88c9-3ebeb9a6b5af"] = "This Sriracha sauce adds the perfect kick to any food. Goes great with momos, noodles, and even sandwiches. The flavour is balanced - spicy but not too overpowering. A must-have for sauce lovers.";
reviews["cb0781f2-70df-4135-b986-090e7753b977"] = "This drying rack is a lifesaver for apartment living. Holds clothes for the whole family and the wheels make it easy to move. Folds up when not needed. Sturdy build quality.";
reviews["f84196ea-d431-4aed-8924-2194c637441f"] = "Comfortable slides for daily wear. The Puma brand quality is there. They look stylish and feel light on the feet. Good for casual outings or wearing at home.";
reviews["e1218dbb-2f81-4a82-b488-9781ec86e399"] = "This rotating tray is very practical for the kitchen. I keep my spice bottles on it and can easily find what I need with a spin. Saves so much time searching in the cabinet. Good quality.";
reviews["0498592b-6fe1-4f39-97c3-93ad7052f6ae"] = "Love the baggy fit of these jeans. They are super comfortable and the cotton fabric is breathable. The high-rise style looks trendy. True to size. Great for casual outings.";
reviews["b1dbbb0a-9761-410a-a411-8ea0acd21566"] = "This playpen gives me peace of mind when I need to get things done around the house. Easy to set up, no tools needed. My baby plays safely inside. The ball pit balls are a fun addition.";
reviews["0684221e-48ea-4577-bc86-e7ecbb3a9c94"] = "Nice oversized crop top for casual wear. The cotton blend is comfortable for daily use. The printed design looks trendy. Good value at this price point.";
reviews["2d780724-e649-4577-824b-3a2ce5bb08b9"] = "Comfortable oversized t-shirt for women. The fabric is soft and breathable. Perfect for college or lounging at home. The fit is relaxed as expected.";
reviews["221d68f2-d2cc-4255-8053-ea6894bd7928"] = "Good quality basic oversized tee. Soft cotton feel. I wear it for casual outings and it goes well with jeans or shorts. The print hasn't faded after washing.";
reviews["4945dbc9-2485-4865-b145-4f599c398986"] = "This dancing cactus toy is hilarious and my kid absolutely loves it. It sings, dances, and repeats whatever my child says. The LED lights are fun. Keeps children entertained for hours.";
reviews["e47fc14a-7f55-4e7e-932b-de3e67446f91"] = "Great toy for babies. The suction base sticks well to the high chair tray. Multiple activities keep my baby engaged. Good for developing motor skills. Safe materials.";
reviews["f0a72772-d6ec-4e36-aec2-cb6295ac4c6d"] = "Very comfortable shoes for walking and daily use. The memory foam feels soft with every step. Breathable upper keeps feet cool. Good grip on different surfaces. Great value at this price.";
reviews["94741f66-45f9-40c0-8d90-ddbb01c39d1b"] = "This 3-in-1 bulb lets you switch between cool white, warm white, and neutral light. Very useful for setting different moods in the room. Bright enough for regular use. Saves electricity too.";
reviews["94913cf8-680e-44c7-8bc9-b958eae116b9"] = "Good quality cotton socks at an affordable price. The pack of 12 pairs lasts a long time. They are comfortable and the colours are nice. Elastic stays good even after many washes.";
reviews["5829b3ed-6682-4def-8d31-b4e0994a829e"] = "This cast iron tawa makes the best dosas and rotis. The taste is noticeably better than non-stick. The seasoning is done well, nothing sticks. Gets better with use. Worth the money.";
reviews["cb6bbd35-7f0d-43bf-8f1c-528c95cc9f2f"] = "Very useful pot for cooking rice and pasta. The built-in strainer lid makes draining so easy - no need for a separate colander. The tri-ply bottom heats evenly. Good quality stainless steel.";
reviews["3b9415c6-ce9e-4ffa-8be5-1325d87ba120"] = "This speaker delivers impressive sound for its size. The bass is deep and clear. Battery lasts all day easily. Connects quickly to my phone. Perfect for outdoor trips and parties.";
reviews["7461e22c-ffd2-4a4a-8a5a-a9675688e38d"] = "Good quality sling bag for everyday use. The water-resistant material is useful for rainy days. Multiple pockets help keep things organised. Comfortable to wear for long periods.";
reviews["1a5fd7b1-bf26-4042-a712-9d5c4cf82890"] = "Stylish and comfortable sneakers from Puma. The white colour goes with everything. Fit is true to size. Good for casual wear and light walks. Looks more expensive than it is.";
reviews["029fe3bf-f244-4a37-87cc-8b7a6b6d3f64"] = "Very useful passport holder for family travel. Keeps all documents organised in one place. The RFID protection is a plus for security. Good build quality. Lightweight and easy to carry.";
reviews["3209f5d6-63ea-4938-81b1-b90f77ce2cbc"] = "These underbed storage bags are great for storing off-season clothes. The material is waterproof so no worries about moisture. Zippers work smoothly. Saves a lot of closet space.";
reviews["522ec5f4-dbbb-459e-9cc8-1ebb08010470"] = "Good quality leather wallet. Compact size fits easily in pockets. Enough slots for cards and cash. The green colour looks unique and classy. Feels premium in hand.";
reviews["19cf989f-5a2b-4d1c-ba26-8b6355c0c480"] = "Sturdy ladder that feels very safe to climb. The wide steps are comfortable. Easy to fold and store. Good for home use like reaching high shelves or changing light bulbs.";
reviews["bd577e32-2857-4551-b6bc-e53910ac36f0"] = "Simple but useful basket for washing vegetables and fruits. The 360-degree rotation makes it convenient. Drains water well. Detachable parts make cleaning easy. Good for daily kitchen use.";
reviews["1365ca33-5407-46f3-8b9b-77e413cf4bf5"] = "Good quality kurta for men. The cotton-polyester blend is comfortable and doesn't wrinkle easily. Regular fit is true to size. Suitable for casual and semi-formal occasions.";
reviews["a73fb687-0fae-4a79-9f38-6e55a64f1d21"] = "Fun little keychain that kids love. The frog sound is cute and not too annoying. Makes a good return gift or stocking stuffer. Easy to attach to bags or keys.";
reviews["cbc50b34-707f-460a-8ab6-1e985e0fef68"] = "Perfect for keeping reminders on the fridge. The magnetic backing sticks well. Writing wipes off cleanly. Good size - not too big, not too small. Reduces paper waste.";
reviews["25c4fa9d-f040-41db-be5a-2f0a77159658"] = "This magnetic notepad is very practical for the kitchen. Write your shopping list and stick it on the fridge. The marker works well and wipes off easily. Looks good too.";
reviews["9cc707cd-1a64-4535-a57b-7dd0a602a67d"] = "Good quality mouse pad with useful shortcut keys printed on it. The surface is smooth and the mouse moves well. Non-slip base keeps it in place. Great for students and office workers.";
reviews["dec490e9-d81d-42a6-a2cf-4c4b64a88156"] = "My child learned so many new words with these talking flash cards. The audio feedback makes learning interactive. Rechargeable battery is convenient. Good educational gift for toddlers.";
reviews["fff745af-f70d-4f51-85d4-e45ee7ec826b"] = "Simple and effective hair dryer. The compact design is easy to handle and store. Two heat settings are sufficient for daily use. The 1000W power dries hair quickly. Good for the price.";
reviews["513e4a6f-619d-40c7-a11f-ff542c4ff30e"] = "Very good neckband for the price. The sound quality is clear with good bass. Battery lasts really long. Quick charging is a bonus. Comfortable to wear all day. Good for calls too.";
reviews["0ef86fd8-4848-44c1-9cde-88eebf1cfb8a"] = "This mouse pad with gel wrist rest has reduced my wrist pain significantly. The gel cushion is soft but supportive. The surface is smooth for accurate mouse movement. Worth it if you use a computer all day.";
reviews["76bb4a61-599a-4e75-bca3-29f93b6adf35"] = "Good additive for keeping the diesel engine clean. I use it every few months and feel the difference in smoothness. Easy to use - just pour into the fuel tank. Worth it for engine maintenance.";
reviews["542fa6e3-5ee8-4dad-ad73-4befaf7009b3"] = "This petrol additive helps keep the engine running smoothly. Noticed better mileage after using it. Easy to use. Good for regular maintenance of your car.";
reviews["fe85448b-da4c-4cea-aa02-1306f6c17f0e"] = "Big storage box with wheels that makes organising easy. The plastic is thick and durable. Wheels make it easy to move even when full. Good for storing kids toys or extra stuff.";
reviews["b61c846d-406e-4c47-8a4a-da589f67d2c4"] = "Good fuel additive for bikes and scooters. Keeps the engine clean and improves performance. Easy to pour into the tank. Affordable way to maintain your two-wheeler.";
reviews["7dc4f2fa-2a0d-4be1-a377-bc0f9e6ebcfd"] = "Works well as a regular petrol additive. Helps keep the fuel system clean. I use it every few months. Good for car maintenance without spending too much.";
reviews["8e06adf2-7e3d-4979-b469-b648b11773b8"] = "Cetaphil cleansing bar is gentle on the skin. Doesn't dry out my face like regular soaps. Good for sensitive skin. Lasts longer than liquid cleansers. Recommended by my dermatologist.";
reviews["2b9a3326-1b3e-47cc-9eec-bc7d6ed0cba1"] = "Powerful mixer grinder for Indian cooking. The bullet design makes it easy to grind small quantities. Works well for chutneys and smoothies. Good build quality at this price.";
reviews["685410c6-a37f-43d7-9316-f1ad0792c429"] = "Simple and useful water bottle. The stainless steel keeps water cool. The sipper cap is convenient for drinking. Fits in the fridge door nicely. No plastic taste.";
reviews["24359d34-d1dd-4355-b002-f260d6e52c33"] = "These cotton fridge bags are great for storing vegetables. Keeps them fresh longer than plastic bags. Eco-friendly alternative. Reusable and washable. Good for the environment.";
reviews["9cc11756-34b6-4ca5-a049-727164314577"] = "Handy vegetable chopper that saves a lot of time in the kitchen. Cuts onions without crying. The blades are sharp. Easy to clean. Good for making quick salads and chopping vegetables.";
reviews["2d597424-88f6-4335-9332-55ff3107e5e0"] = "This electric chopper is very useful for quick chopping tasks. The 300W motor is powerful enough for most vegetables. The bowl is a good size. Much faster than cutting by hand.";
reviews["7a4fef32-87b3-45e3-aad4-bfa12466cf37"] = "Good quality cabin luggage from Skybags. The 8 wheels make it smooth to roll. The hard shell protects belongings well. Lock works fine. Looks stylish. Good value for the price.";
reviews["376806c9-c364-4a0b-b9e8-a8f255357efd"] = "Very simple and sturdy mobile stand. The metal body gives it weight so it doesn't tip over. Works with all phone sizes. Good for watching videos hands-free. At this price, just buy it.";
reviews["a4778617-fc2b-42d2-8482-f62bca56d00f"] = "Good quality cotton belt for men. The D-ring buckle looks casual and stylish. The cotton material is comfortable. Perfect for casual wear with jeans or chinos.";
reviews["b129836c-9e01-4a90-af71-514ada2e9b87"] = "Simple wired doorbell that does the job. The sound is clear and loud enough to hear from any room. Easy to install. Good quality for the price. No batteries needed.";
reviews["7d6d5094-684d-4a97-a727-3958519e8cae"] = "JBL never disappoints with sound quality. This speaker delivers powerful audio with deep bass. Battery backup is great for outdoor use. The build quality is solid. Worth every rupee.";
reviews["024054be-904a-42d9-b6ad-5c633a05e7d0"] = "Good quality garbage bags from Amazon brand. They are thick and don't tear easily. The 180 count will last a long time. Perfect size for kitchen dustbins. Good value pack.";
reviews["c9e2a52c-aa9a-430c-b42a-a514a122254e"] = "Very good neckband for music and calls. Battery lasts about 40 hours which is great. The sound quality is nice with good bass. Magnetic buds are convenient. Fast charging works well.";
reviews["964d7915-ecb8-4a45-b443-c6e6253e41ca"] = "Cute cycle-shaped planter for home decor. The metal construction is sturdy. Looks unique and eye-catching. Good size for small plants. Makes a nice gift for plant lovers.";
reviews["1ae7858a-49a7-43cb-8de3-6d3c2d41df49"] = "Useful shoe bags for travel. Keeps shoes separate from clothes in the suitcase. Drawstring closure is convenient. Lightweight and doesn't take up space. Good for gym use too.";
reviews["db154fc3-0108-4f12-adff-8bc609801261"] = "Pack of 6 shoe bags at a great price. The material is decent quality. Perfect for organising shoes while travelling. Also useful for storing shoes at home. Worth buying.";
reviews["ed24d120-294f-4ddb-90a9-4ba5bddaf5c2"] = "Good quality automatic umbrella. Opens and closes with one button. The windproof design holds up well in strong winds. The size is good for one person. Comfortable handle.";
reviews["8f553d76-c45c-4527-80d0-38a8c8fc01e3"] = "These packing cubes have made travelling so much more organised. I can separate clothes by type. The material is lightweight and durable. Zippers work well. Great for frequent travellers.";
reviews["908290f0-91c2-412d-bd1a-2ca3110cc09a"] = "Good portable speaker from Boat. The sound is loud and clear for its size. Battery life is decent. Connects easily via Bluetooth. Good for outdoor or bathroom listening.";
reviews["7d617d1e-993f-4ad6-85a2-97836a272907"] = "Great wireless headphones for the price. The 40mm drivers deliver good sound quality. Battery lasts very long. Comfortable padding for long listening sessions. Good for music and calls.";
reviews["3539002a-4c9a-419a-9014-97b6ac52172e"] = "Duracell batteries are reliable and last long. This pack of 20 is great value for money. Perfect for remote controls, toys, and other devices. Trusted brand, good quality.";
reviews["3950346b-d5a8-4bba-aafd-9139aa6191ec"] = "Excellent noise cancelling headphones from JBL. The ANC blocks out almost all background noise. Sound quality is superb. Comfortable for long flights or work sessions. Premium feel.";
reviews["4b9a2a06-b20a-4ca1-95e6-644c1b01c60f"] = "Good laptop sleeve that fits my 15.6 inch laptop perfectly. The extra front pocket is useful for the charger. The material feels durable and water-resistant. The handle makes it easy to carry.";
reviews["579a787b-e63b-4d11-9881-1c0a0347b119"] = "Nice little chopper for quick kitchen tasks. The rechargeable feature is convenient. The bowl is food grade quality. Works well for chopping onions, garlic, and ginger. Compact and easy to store.";
reviews["d6c9de32-8302-4ea1-90a9-34c1528f9b3f"] = "Beautiful kurta palazzo set. The cotton fabric is comfortable for daily wear. The design is elegant and the fit is good. Received many compliments. Good value for money.";
reviews["44e0e78c-dcfe-4ffa-a5d7-69312e8bf51a"] = "Nice kurta set with dupatta. The cotton blend is breathable and comfortable. The sleeveless design is good for summer. The silk dupatta adds elegance. Suitable for casual and festive wear.";
reviews["c0d2cef2-6dbc-407e-9b05-e2116ce3dac3"] = "Beautiful Anarkali kurta set with embroidery. The fabric is comfortable and the stitching is neat. Perfect for parties and festive occasions. The colour is just like the picture.";
reviews["be7f0093-6034-4577-bb62-4ab694b36c76"] = "Cute backpack for toddlers. My child loves the animal design. The size is perfect for small kids. Lightweight and comfortable. Good for daycare or short outings.";
reviews["11acb4ed-67f8-45c5-b24e-4967e0e508e0"] = "Good quality wallet with RFID protection. Has enough slots for cards and cash. The material feels nice. Slim design fits in front pocket easily. Good value at this price.";
reviews["354d37e6-9bc4-4ade-89e0-868e9a0d085c"] = "Comfortable loafers for women. The fit is true to size. Good for office or casual wear. The material is soft and doesn't hurt the feet even after wearing all day. Stylish design.";
reviews["646b95b0-2316-4254-91e7-1decebd758fb"] = "Nice oversized t-shirt for women at a very affordable price. The fabric is soft and comfortable. The oversized fit is trendy. Good for college or casual outings. Washes well.";
reviews["28f53bef-bd3c-4b10-b7c5-c62651f9cde2"] = "Sony headphones with noise cancellation at this price is a great deal. The ANC works well for the price. Sound quality is clear with good balance. Comfortable for long use. Good for commuting.";
reviews["aa464b30-2dfe-4a8d-893c-2af6d0f90baa"] = "Philips air fryer cooks food perfectly with very little oil. The touch panel is easy to use. The 1700W power heats up fast. Food comes out crispy and healthy. Worth investing for health.";
reviews["02426210-f0ea-477e-a8f6-9c6df39e0902"] = "This Xiaomi TV offers great picture quality at this price. The QLED display is bright and colours are vibrant. The Fire TV interface is smooth. Value for money is excellent.";
reviews["aedc8f89-4a1f-4c34-b7c1-f97ee02c791b"] = "These fairy lights add a nice ambiance to any room. USB powered is convenient. 10 meters is enough for decorating a medium room. The lights are bright enough. Good for festivals.";
reviews["aee93300-4291-4d06-82e4-2c4cca6d487e"] = "Reliable memory card from SanDisk. The 128GB capacity is good for storing photos and videos. Read speed is fast. I use it in my phone and it works perfectly. Trusted brand.";
reviews["f658da78-3da5-4740-ac96-18cd377ab267"] = "This dash cam records very clear video even at night. The 3K resolution captures number plates easily. The ADAS features are useful. GPS logging is accurate. Worth it for safety.";
reviews["7aaa779f-cbe2-470f-9711-871143acc068"] = "Excellent noise cancelling earbuds from Oppo. The ANC is very effective. Sound quality is rich and clear. Battery life is good. Comfortable fit for long use. Great value.";
reviews["cd85d749-a062-4628-a478-757432fd5f78"] = "OnePlus earbuds with great ANC and sound quality. The bass is punchy and the highs are clear. The fit is comfortable. Battery backup is decent. Perfect for OnePlus phone users.";
reviews["44f16baa-15c9-42bd-8b96-976a8ab834a1"] = "Best noise cancelling headphones I have ever used. The ANC is incredible. Sound quality is top notch. Super comfortable even after hours of use. If you can afford it, just get them.";
reviews["ccffabca-cf9a-41f0-b87c-011c2aeff951"] = "Nice compact umbrella that fits in a bag easily. The auto open-close feature is very convenient. The windproof design holds up well. The carabiner handle is useful for hanging. Good quality.";
reviews["15eab187-c381-4964-aa24-2ccd5ef7b975"] = "Sony headphones with powerful bass and good noise cancellation. The ULT sound signature is fun for music lovers. Battery lasts very long. Comfortable for long listening. Premium quality.";
reviews["ba1c14b5-daca-409b-94dd-c6c33f0aea4f"] = "Good quality jaggery powder from Amazon brand. The 1 kg jar is convenient. It's pure cane jaggery with no additives. Tastes natural. Good for making sweets and traditional recipes.";
reviews["6fd04f5f-b1fe-479a-94f9-b24ebdeef931"] = "This powerbank is small enough to fit in a pocket but has massive 20000mAh capacity. Charges my phone 3-4 times. The build quality is good. Fast charging works as advertised. Perfect for travel.";
reviews["df0ce962-189d-4ba8-b550-6c47f03f303c"] = "Classic glass jar from Borosil that keeps food fresh. The air-tight seal works well. Good for storing pulses, spices, or cookies. The glass is thick and durable. Looks nice on the counter.";
reviews["0b5dcb45-2cfd-4203-9413-29b775d6cfdd"] = "Very good earbuds from OnePlus at an affordable price. Battery life is excellent. Sound quality is good for the price. Comfortable fit. Good for daily use and workouts.";
reviews["e3e4ea5d-5207-49b4-a0ac-29bc8cf294b8"] = "Good wireless keyboard that works with both Bluetooth and USB receiver. The keys are comfortable to type on. Rechargeable battery saves on batteries. Compact design saves desk space. Good for work.";
reviews["5c118af0-196d-444f-8b6a-13b84592c679"] = "Handy little fan that folds flat. The LED light is useful during power cuts. Rechargeable battery lasts a few hours. Good for desk use or outdoors. Quiet operation.";
reviews["9ca76842-4cd0-4c92-bf04-a0b19932c248"] = "Gentle baby wash that doesn't irritate my baby's skin. The rich moisture formula keeps the skin soft. The mild fragrance is pleasant. Good for everyday use. Trusted brand for babies.";
reviews["70c89955-9189-461a-ba67-b6f9cfcadb3c"] = "Nice everyday perfume for women. The fragrance is pleasant and lasts a few hours. Good value at this price point. The bottle looks elegant. Suitable for daily office wear.";
reviews["ae0d5385-2720-4a7a-8234-efaa04ce7f0a"] = "Very useful mobile stand for desk use. The adjustable angle helps find the perfect viewing position. Sturdy build holds the phone securely. Compact and doesn't take much space. Good for video calls.";
reviews["8eedc15a-7f11-4807-aa9c-57be3e25e526"] = "Good quality medium-size suitcase for travel. The 8 wheels make it easy to move. Hard case protects belongings. The lock is secure. Looks stylish. Good value for the price.";
reviews["e6051f2f-eaaf-4180-a8e3-73fb4667df47"] = "Strong charging cable that doesn't break easily. The braided design is durable. 2 meters length is convenient. Supports fast charging. Good for home or car use.";
reviews["8aae1a80-872c-4859-9a96-a5be8397b057"] = "Compact car charger that charges two devices at once. The PD port charges my phone fast. Dual output is convenient for passengers. Good build quality. Works well with all my devices.";
reviews["11370cb1-b1af-4358-9288-c994c4207724"] = "Strong braided cable that supports fast charging. The Type C to Type C design works with modern phones. 60W power delivery is good for charging laptops too. Good price for the quality.";
reviews["2fcedd2c-8ca8-4915-a3e0-d795a6dc9309"] = "Compact Alexa speaker that fits anywhere. The sound quality is decent for its small size. Voice recognition works well. Good for controlling smart home devices. Perfect for small rooms.";
reviews["ddd6f91e-de51-4a06-b926-a449b58803a7"] = "This transparent mouse looks really cool on my desk. The Bluetooth connection is stable. Rechargeable battery lasts about a month. The battery display is a thoughtful feature. Good for work and casual use.";
reviews["81acc14e-5673-4bcc-8f63-603ca18dd2ad"] = "Tiny adapter that lets you connect USB devices to your phone. Works perfectly with pendrives and keyboards. The 5Gbps speed is fast enough for most tasks. Very useful gadget to keep handy.";
reviews["5e4336f6-1861-4bdb-be38-a6a8ee5ac048"] = "Good quality Type C earphones at a budget price. The sound is clear with decent bass. The in-line mic works well for calls. Comfortable fit. Good backup or daily use earphones.";
reviews["75808b08-6fbd-42e1-b477-2557eafecc52"] = "Compact and comfortable earbuds from Samsung. The sound quality is balanced and clear. The wingtips keep them secure in the ears. Touch controls work well. Good for Samsung users.";
reviews["f6ceda8b-e215-4304-9cef-44848cfc4f09"] = "The best Echo Dot yet. Sound quality has improved a lot. Good for playing music, setting alarms, and controlling smart devices. Easy to set up. Great entry into smart home.";
reviews["2a34ca5c-7690-4f13-b90e-2502b6f359f9"] = "This Echo Dot Max fills the room with sound. The bass is impressive for such a compact speaker. The smart home hub feature is useful. The motion sensor is a nice addition. Worth the upgrade.";
reviews["8be1c85b-ef8b-4201-8b2b-e52c8909a221"] = "This kitchen cleaner works really well on grease. The foaming formula means less scrubbing. Smells fresh. Good for stove tops and kitchen counters. A bottle lasts a long time.";
reviews["e1fd14f2-99a9-4050-aed8-95c131431629"] = "Beautiful saree for parties and weddings. The organza fabric looks elegant. The embroidery is detailed and well done. The colour is exactly as shown. Received many compliments.";
reviews["5d41225c-94f9-4978-b2f4-228f27ddd70b"] = "Very comfortable slippers for daily home use. The orthopedic design helps with foot pain. The soft platform feels like walking on cushion. Non-slip sole is good for bathroom use. Good quality.";
reviews["1abbe45d-d0cc-40bb-a90c-bbebcf310fa9"] = "These slippers are super soft and comfortable. Perfect for pregnant women or those with foot pain. Lightweight and easy to wear. The material is skin-friendly. Good value.";
reviews["4488c2a6-61d5-4f2f-bd87-0d86f5042c69"] = "Complete gardening kit with all essential tools. The quality is good for home gardening. The pruner cuts well. Gloves fit nicely. Good for beginners starting their garden.";
reviews["babcbcd9-6762-4701-b79d-838636e1880e"] = "Good basic gardening tool set at a very affordable price. The stainless steel tools are rust-resistant. Wooden handles feel comfortable. Perfect for small gardening tasks. Good value pack.";
reviews["3d16a4c3-e6d8-4746-aed9-316164c50f2a"] = "Easy to install towel rod with strong adhesive. No drilling needed. The aluminum build is rust-resistant. Holds towels well. Looks neat in the bathroom. Good for rented homes.";
reviews["3d72ce60-a3d9-4fb5-bc47-6993cdd7fb2e"] = "These sponge cloths are very absorbent and durable. They can be washed and reused many times. Good for wiping kitchen surfaces. No lint left behind. Better than paper towels.";
reviews["1c9974be-d1b0-43cf-ae1f-acf378178b43"] = "Comfortable night dress for women. The cotton fabric is soft and breathable. Korean style looks cute. The shorts set is comfortable for sleeping. Good value at this price.";
reviews["ba0aa5bc-53df-48a4-952e-4a049f707390"] = "Nice dress that can be styled in different ways. The fabric drapes well. The floral design is pretty. Good for casual outings or parties. Comfortable fit.";
reviews["ddf2538f-e7f7-4d79-9e29-abf2130ede62"] = "Beautiful maxi dress for women. The rayon fabric is breathable and comfortable. The long flared design looks elegant. Good for summer and festive occasions. True to size.";
reviews["3b57db91-d2c6-4ee3-b769-9737f0c557ce"] = "Good quality ironing board that doesn't wobble. The adjustable height is convenient. The cotton cover is smooth and doesn't snag clothes. The iron holder is useful. Folds flat for storage.";
reviews["90338a6b-5f36-493b-a0f1-e8f16f891b59"] = "Nice stainless steel containers for tea and sugar. The airtight seal keeps contents fresh. The labels help identify easily. Good size for daily use. Looks classy on the kitchen shelf.";
reviews["fc0bbd6c-006a-4d13-8be6-2c8478f97d28"] = "Good set of kitchen containers for tea, sugar, and coffee. The airtight lids keep everything fresh. The design is nice and practical. Stackable design saves space. Good for pantry organisation.";
reviews["f8d35b24-7bf3-4c7e-9f78-49031cce3f67"] = "Very lightweight moisturiser that doesn't feel sticky. Absorbs quickly into the skin. The hyaluronic acid keeps skin hydrated all day. Good for Indian weather. Doesn't cause breakouts.";
reviews["3f0a625a-d1f6-489a-ab2c-e3b0b9046cca"] = "Beautiful organza saree at an affordable price. The fabric is good quality. The blouse piece matches well. Perfect for parties and weddings. Looks more expensive than it is.";
reviews["66d8af0b-4cdb-4d63-bdcd-6b62ffc284b6"] = "Pretty chiffon saree with nice flower prints. Lightweight and easy to carry. The colour combination is beautiful. Good for casual events and festivals. Good value.";
reviews["f97642f0-6fdc-4175-8a52-517066ab15dd"] = "Pack of 3 oversized t-shirts is great value. The cotton is soft and comfortable. The prints are trendy and fun. The oversized fit is perfect for casual wear. Washes well.";
reviews["badd4cff-f227-4c42-86fc-d5175e2dc70c"] = "Very useful spice rack that rotates 360 degrees. Finding spices is now so easy. The jars are transparent so you can see what's inside. The rotation works smoothly. Saves cabinet space.";
reviews["c5b1b00c-c3d7-4e7c-b432-2df52cf2552c"] = "Good quality wooden dining table set. The sheesham wood looks premium. The 4-seater size is perfect for a small family. Sturdy construction. Assembly was straightforward. Looks great in the dining room.";
reviews["a57ee472-5dbe-4520-bbcc-87434846c3da"] = "Simple and accurate kitchen scale. The digital display is clear and easy to read. Good for measuring ingredients for cooking and baking. Compact size stores easily. Battery included.";
reviews["76f212ad-e0af-4e21-a699-cc44ee9fef5c"] = "Nice glass oil dispenser bottle. The pourer works well without dripping. The transparent glass lets you see the oil level. The 500ml size is good for daily use. Looks elegant on the kitchen counter.";
reviews["f05863b1-a377-453e-a740-9a4d47a322ae"] = "Good manual juicer for fresh juice at home. Easy to use and clean. The stainless steel handle is sturdy. Works well for oranges and other citrus fruits. Good for health-conscious people.";
reviews["755b162f-ecd3-4bb9-9024-1aae6869a706"] = "Good quality slim fit jeans from Pepe Jeans. The cotton with elastane gives a comfortable stretch. The fit is true to size. Looks stylish. Worth the price for a branded jeans.";
reviews["2948cda2-a037-451f-9cf0-2ca1400be6fa"] = "Best streaming stick for 4K TVs. The picture quality is excellent with Dolby Vision. The remote works well. Easy to set up. Access to all major apps. Much better than smart TV interfaces.";
reviews["734e75ff-8980-40c7-a33b-1783f9e2bd2a"] = "Great HD streaming stick at an affordable price. The new Fire TV interface is smooth. Full HD picture quality is crisp. Compact design is travel-friendly. Good for non-4K TVs.";
reviews["f314ca73-3bb6-4e0e-bddf-e62da0b8d95a"] = "Effective kitchen cleaner that cuts through grease. The spray works well. Leaves a clean smell. Good for countertops and stoves. A trusted brand for cleaning products.";
reviews["6281dc0b-d358-43b6-b669-4f18c28ca592"] = "Good quality kitchen towel rolls from Amazon brand. The non-woven fabric is strong even when wet. Washable and reusable. Good for wiping and cleaning. Better than paper towels.";
reviews["f51262f9-4246-4ad5-b89d-841900b47e3a"] = "Beautiful maxi dress with a flattering fit. The V-neck design is elegant. The puff sleeves add a nice touch. The fabric has a good drape. Suitable for both casual and formal occasions.";
reviews["26e2b418-d985-4161-96f6-081112ea40b6"] = "These fridge storage boxes keep vegetables fresh for longer. The drain plate at the bottom prevents moisture buildup. Stackable design saves space. Good quality plastic. Very useful for kitchen organisation.";
reviews["d110def4-27f7-4af1-a4e7-7f00e9c9145b"] = "Good massager for relaxing sore muscles. The different heads work well for different body parts. The mesh cover prevents hair tangling. Lightweight and easy to use. Good for post-workout recovery.";
reviews["33d0e080-302c-49d3-b7d2-8adf3fd1237d"] = "Beautiful mangalsutra set with earrings. The gold plating looks premium. The heart shape design is modern and elegant. Comes in a nice gift box. Good for daily wear or special occasions.";
reviews["6e9c2f50-e750-4dd5-832f-5c734a095e6c"] = "Perfect makeup bag for travel. The transparent design makes it easy to find things. Large capacity fits all essentials. The hand strap is convenient. Good quality material. Very practical.";
reviews["6b39bf2a-e692-4f13-8c1a-099244b97b79"] = "Clever paper towel holder that hangs on cabinet doors. No drilling needed. Saves counter space. The metal construction is sturdy. Easy to install. Very useful for small kitchens.";
reviews["928f3c5f-750b-4c28-9d15-5d407dd31bc2"] = "Good quality airtight containers for kitchen storage. The seals keep food fresh. The set includes different sizes. Transparent design makes it easy to see contents. Good for organising the pantry.";
reviews["f91563c6-0cf3-454c-a325-794799ee7b65"] = "Original OnePlus charging cable that supports fast charging. The build quality is good. The braided cable is durable. Works perfectly with OnePlus phones. Good length for daily use.";
reviews["cca3a40f-e7c1-4ae3-afab-24cafb267596"] = "This kitchen tap spray head makes washing dishes so much easier. The button control is convenient. Multiple spray patterns work well. Easy to install. Good quality chrome finish.";
reviews["67002a67-bda3-41e2-bdd3-c7a9d11f578c"] = "Very useful broom holder that keeps everything organised. Easy to install. Holds multiple brooms and mops securely. The hooks are also useful for hanging other items. Good for keeping the balcony tidy.";
reviews["bb92df04-fe5e-4c33-a778-69fb763e80a6"] = "Good portable fan with dual heads. The 360-degree rotation is useful. The 3-speed settings give good control. Runs quietly. The USB power is convenient for car or desk use. Good airflow.";
reviews["ef3c3efe-e172-4c2e-a221-c0aba94b000d"] = "Powerful gaming laptop at a good price. The RTX 3050 handles most modern games well. The 144Hz display is smooth. The build quality is decent. Good for gaming and college work.";
reviews["4cdccfc0-de5a-4e22-a6ff-d36b7b3d800a"] = "Good quality microfiber cloths for car cleaning. They absorb water well and don't scratch the paint. Lint-free finish leaves no marks. The pack of 4 is good value. Reusable and washable.";
reviews["a08c670d-e343-4933-9c27-91b1fd315877"] = "Beautiful printed maxi dress with a traditional touch. The chevron pattern is stylish. The fabric is comfortable. The puff sleeves add a nice detail. Good for parties and festive occasions.";
reviews["022ffb86-bec7-4a59-9197-83b5a97587d0"] = "Easy to install paper roll holder. The adhesive is strong and holds well. No drilling needed. The stainless steel looks good. Good for kitchen or bathroom. Perfect for rented homes.";
reviews["ca82eb46-cd8d-40aa-b72d-c0cc0fc0f269"] = "This extension board is perfect for my desk. The multiple Type C ports mean I don't need separate chargers. The 5 AC sockets handle all my devices. Good build quality. Worth buying.";
reviews["d40dd57d-7d73-45bc-9d4a-9966e65dd95c"] = "This GaN charger is a space-saver on my desk. The 65W PD charges my laptop quickly. Multiple ports mean I can charge everything at once. Doesn't heat up much. Compact and powerful.";
reviews["7879fb27-a11b-45a5-bf91-7f3480fdc800"] = "Useful power strip with both AC and USB ports. The PD 20W port charges phones fast. The master switch is convenient. Good build quality. Suitable for home and office use.";
reviews["022d8eb9-bf54-4242-908c-2d5dc6dc6676"] = "Compact USB hub that adds extra ports to my laptop. The 5Gbps speed is good for data transfer. The build quality is premium. Works without any drivers. Good for ultrabook users.";
reviews["ada0c7f9-3c0b-4dda-9b28-cb398084417b"] = "This 9-in-1 hub covers all my connectivity needs. The 4K HDMI output works perfectly with my monitor. The USB ports are fast. The HDMI on/off button is a thoughtful feature. Good for office use.";
reviews["9d0fabad-06e3-4591-a390-46de8a608ab9"] = "Good quality USB-C hub from Amazon Basics. The aluminium body looks premium. The HDMI port works well for external displays. The ethernet port is useful. Good value for the features offered.";

const sql = Object.entries(reviews).map(([id, review]) => {
  const escaped = review.replace(/'/g, "''");
  return `UPDATE products SET review = '${escaped}' WHERE id = '${id}';`;
}).join('\n');

const filePath = '/tmp/product-reviews.sql';
import { writeFileSync } from 'fs';
writeFileSync(filePath, sql);

console.log(`Generated ${Object.keys(reviews).length} review updates.`);
console.log(`SQL written to ${filePath}`);
