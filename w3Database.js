var w3Database;

function w3WebSQLInit() {
    var w3DBObj = this;
    w3Database = window.openDatabase('W3SchoolsDemoDatabase', '1.0', 'W3SchoolsDemoDatabase', 2 * 1024 * 1024);
    function w3DropTable(tablename) {
        var sql="DROP TABLE [" + tablename + "]";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[]);
            }
            ,function (err) {
                window.alert("Error 3: " + err.message);
            }
    
        );
    }
    function w3DropView(tablename) {
        var sql="DROP VIEW [" + tablename + "]";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[]);
            }
            ,function (err) {
                window.alert("Error 4: " + err.message);
            }
        );
    }
    function w3DropIndex(tablename) {
        var sql="DROP INDEX [" + tablename + "]";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[]);
            }
            ,function (err) {
                window.alert("Error 5: " + err.message);
            }
    
        );
    }
    function checkDBChanges(x) {
        if (
            x.toUpperCase().indexOf("INSERT INTO ")>-1 ||
            x.toUpperCase().indexOf("UPDATE ")>-1 ||
            x.toUpperCase().indexOf("DELETE ")>-1 ||
            x.toUpperCase().indexOf("ALTER TABLE ")>-1 ||
            x.toUpperCase().indexOf("DROP TABLE ")>-1 ||
            x.toUpperCase().indexOf("INTO ")>-1 ||
            x.toUpperCase().indexOf("CREATE TABLE ")>-1 ||
            x.toUpperCase().indexOf("ALTER TABLE ")>-1 ||
            x.toUpperCase().indexOf("CREATE VIEW ")>-1 ||        
            x.toUpperCase().indexOf("REPLACE VIEW ")>-1 ||
            x.toUpperCase().indexOf("DROP VIEW ")>-1 ||
            (x.toUpperCase().indexOf("CREATE INDEX")>-1 ) ||
            (x.toUpperCase().indexOf("CREATE UNIQUE INDEX")>-1 ) ||        
            (x.toUpperCase().indexOf("DROP INDEX")>-1 )        
            ) {
            return true;
        }
        return false;
    }
    this.w3ExecuteSQL = function(sql) {
        var resultContainer;
        resultContainer = document.getElementById("divResultSQL");
        resultContainer.innerHTML = "";
        w3Database.transaction(function (tx)
            {
                tx.executeSql(sql,[],function (tx, results)
                    {
                        var len = results.rows.length, i, j, m, txt, columns = [], DBChanges = 0;
                        if (len > 0) {
                            txt = "";
                            txt = txt + "<div style='padding:10px;'><div style='margin-bottom:10px;'>Number of Records: " + len + "</div>";
                            txt = txt + "<table class='w3-table-all notranslate'><tr>";
                            for (m in results.rows.item(0)) {
                                columns.push(m);
                            }
                            for (j = 0; j < columns.length; j++) {
                                txt = txt + "<th>" + columns[j] + "</th>";  
                            }
                            txt = txt + "</tr>";
                            for (i = 0; i < len; i++) {
                                txt = txt + "<tr>";       
                                for (j = 0; j < columns.length; j++) {
                                    if (results.rows.item(i)[columns[j]] == null) {
                                        txt = txt + "<td><i>null</i></td>";  
                                    } else {
                                        txt = txt + "<td>" + results.rows.item(i)[columns[j]] + "</td>";
                                    }                                    
                                }
                                txt = txt + "</tr>";       
                            }
                            resultContainer.innerHTML =  txt + "</table></div>";
                        } else {
                            DBChanges = checkDBChanges(sql);
                            if (DBChanges === true) {
                                txt = "<div style='padding:10px;'>You have made changes to the database.";
                                if (results.rowsAffected > 0) {txt = txt + " Rows affected: " + results.rowsAffected; }
                                resultContainer.innerHTML = txt + "</div>";
                            } else {
                                txt = "<div style='padding:10px;'>No result.</div>";
                                resultContainer.innerHTML = txt;
                            }
                        }
                        w3DBObj.myDatabase();
                    }
                );
            }
            ,function (err) {
                window.alert("Error 1: " + err.message);
            }
        );
    };
    this.selectStar = function (tablename) {
        var sql = "SELECT * FROM [" + tablename + "]";
        document.getElementById("textareaCodeSQL").value = sql;
        if (window.editor) {
          window.editor.getDoc().setValue(sql);
        }
        w3DBObj.w3ExecuteSQL(sql);
    };
    this.myDatabase = function () {
        w3Database.transaction(function (tx)
            {
                var tblnames = [], recordcounts = [], viewnames = [], viewrecordcounts = [], indexnames = [];
                document.getElementById("yourDB").innerHTML = "";
                document.getElementById("yourRC").innerHTML = "";
                document.getElementById("yourIX").innerHTML = "";                
                function w3DBInfo() {
                    var txt = "", i;
                    txt = txt + "<table width='100%' xclass='w3-table-all notranslate'><tr>";
                    txt = txt + "<th style='text-align:left;'>Tablename</th>";  
                    txt = txt + "<th style='text-align:right;'>Records</th>";                          
                    txt = txt + "</tr>";
                    for (i = 0; i < tblnames.length; i++) {
                        txt = txt + "<tr>";       
                        txt = txt + "<td title='Click to see the content of the " + tblnames[i] + " table' style='text-align:left;cursor:pointer;text-decoration:underline;' onclick='w3schoolsWebSQL1.selectStar(\"" + tblnames[i] + "\")'>" + tblnames[i] + "</td>";  
                        txt = txt + "<td style='text-align:right;'>" + recordcounts[i] + "</td>";                  
                        txt = txt + "</tr>";       
                    }
                    document.getElementById("yourDB").innerHTML =  txt + "</table>";
                }
                function w3DBViewInfo() {
                    var txt = "", i;
                    txt = txt + "<h4>Views:</h4>";
                    txt = txt + "<table width='100%' xclass='w3-table-all notranslate'><tr>";
                    txt = txt + "<th style='text-align:left;'>Name of View</th>";  
                    txt = txt + "<th style='text-align:right;'>Records</th>";                          
                    txt = txt + "</tr>";
                    for (i = 0; i < viewnames.length; i++) {
                        txt = txt + "<tr>";       
                        txt = txt + "<td title='Click to see the content of the " + viewnames[i] + " view' style='text-align:left;cursor:pointer;text-decoration:underline;' onclick='w3schoolsWebSQL1.selectStar(\"" + viewnames[i] + "\")'>" + viewnames[i] + "</td>";  
                        txt = txt + "<td style='text-align:right;'>" + viewrecordcounts[i] + "</td>";                  
                        txt = txt + "</tr>";       
                    }
                    document.getElementById("yourRC").innerHTML =  txt + "</table>";
                }
                function w3DBIndexInfo() {
                    var txt = "", i;
                    txt = txt + "<h4>Indexes:</h4>";
                    txt = txt + "<table width='100%' xclass='w3-table-all notranslate'><tr>";
                    txt = txt + "<th style='text-align:left;'>Name of Index</th>";  
                    txt = txt + "</tr>";
                    for (i = 0; i < indexnames.length; i++) {
                        txt = txt + "<tr>";       
                        txt = txt + "<td style='text-align:left;'>" + indexnames[i] + "</td>";  
                        txt = txt + "</tr>";       
                    }
                    document.getElementById("yourIX").innerHTML =  txt + "</table>";
                }
                function makeRecordcountsArray(x) {
                    var i, lastTable = false;
                    for (i = 0; i < x.length; i++) {
                        if (i === (x.length - 1)) {lastTable = true; }
                        tx.executeSql("SELECT count(*) AS rc,'" + lastTable + "' AS i FROM [" + x[i] + "]",[],function (tx, results)
                            {
                                var len = results.rows.length, k, cc = "";
                                if (len > 0) {
                                    for (k = 0; k < len; k++) {
                                        recordcounts.push(results.rows.item(k).rc);
                                        cc = results.rows.item(k).i;
                                    }
                                    if (cc === "true") {
                                        w3DBInfo();
                                    }
                                } else {
                                    window.alert("ERROR 4");
                                }
                            
                            }
                        );
                    }
                }
                function makeViewRecorcountsArray(x) {
                    var i, lastTable = false;
                    for (i = 0; i < x.length; i++) {
                        if (i === (x.length - 1)) {lastTable = true; }
                        tx.executeSql("SELECT count(*) AS rc,'" + lastTable + "' AS i FROM [" + x[i] + "]",[],function (tx, results)
                            {
                                var len = results.rows.length, k, cc = "", txt;
                                if (len > 0) {
                                    for (k = 0; k < len; k++) {
                                        viewrecordcounts.push(results.rows.item(k).rc);
                                        cc = results.rows.item(k).i;
                                    }
                                    if (cc === "true") {
                                        w3DBViewInfo();
                                    }
                                } else {
                                    window.alert("ERROR 5");
                                }
                            
                            }
                        );
                    }
                }
                tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='table' AND tbl_name NOT LIKE '__WebKitDatabaseInfoTable__' AND tbl_name NOT LIKE 'sqlite_sequence'",[],function (tx, results)
                    {
                        var len = results.rows.length, i;
                        if (len > 0) {
                            for (i = 0; i < len; i++) {
                                tblnames.push(results.rows.item(i).tbl_name);
                            }
                            makeRecordcountsArray(tblnames);
                        }
                    }
                );
                tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='view'",[],function (tx, results)
                    {
                        var len = results.rows.length, i;
                        if (len > 0) {
                            for (i = 0; i < len; i++) {
                                viewnames.push(results.rows.item(i).tbl_name);
                            }
                            makeViewRecorcountsArray(viewnames);
                        }
                    }
                );
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name NOT LIKE '__WebKitDatabaseInfoTable__'",[],function (tx, results)
                    {
                        var len = results.rows.length, i;
                        if (len > 0) {
                            for (i = 0; i < len; i++) {
                                indexnames.push(results.rows.item(i).name);
                            }
                            w3DBIndexInfo();
                        }
                    }
                );
            }
            ,function (err) {
                window.alert("ERROR 2.5" + err.message);
            }
        );
    };
    this.w3InitDatabase = function(n) {
        w3DBObj.w3InitCustomers();
        w3DBObj.w3InitCategories();
        w3DBObj.w3InitEmployees();
        w3DBObj.w3InitOrderDetails();    
        w3DBObj.w3InitOrders();        
        w3DBObj.w3InitProducts();            
        w3DBObj.w3InitShippers();                
        w3DBObj.w3InitSuppliers(n);    
    };
    this.w3ClearDatabase = function() {
        var warn = window.confirm("This action will restore the database back to its original content.\n\nAre you sure you want to continue?");
        if (warn === false) {
            return false;
        }
        document.getElementById("divResultSQL").innerHTML =  "";
        if (w3Database) {
            w3Database.transaction(function (tx)
                {
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='index' AND name<>'sqlite_autoindex___WebKitDatabaseInfoTable___1'",[],function (tx, results)
                        {
                            var len = results.rows.length, i;
                            if (len>0) {
                                for (i = 0; i < len; i++) {
                                    w3DropIndex(results.rows.item(i).name);
                                }
                            }
                        }
                    );
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='view'",[],function (tx, results)
                        {
                            var len = results.rows.length, i;
                            if (len>0) {
                                for (i = 0; i < len; i++) {
                                    w3DropView(results.rows.item(i).name);
                                }
                            }
                        }
                    );
                    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name<>'sqlite_sequence' AND name<>'__WebKitDatabaseInfoTable__'",[],function (tx, results)
                        {
                            var len = results.rows.length, i;
                            if (len>0) {
                                for (i = 0; i < len; i++) {
                                    w3DropTable(results.rows.item(i).name);
                                    if (i === (len - 1)) { w3DBObj.w3InitDatabase(1); }
                                }
                            } else {
                                w3DBObj.w3InitDatabase(1);
                            }
                        }
                    );
                }
                ,function (err) {
                    window.alert("Error 2: " + err.message);
                }
            );
        }
    };
    this.w3InitCategories = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Categories (CategoryID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,CategoryName NVARCHAR(255),Description NVARCHAR(255))',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Beverages","Soft drinks, coffees, teas, beers, and ales")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Condiments","Sweet and savory sauces, relishes, spreads, and seasonings")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Confections","Desserts, candies, and sweet breads")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Dairy Products","Cheeses")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Grains/Cereals","Breads, crackers, pasta, and cereal")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Meat/Poultry","Prepared meats")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Produce","Dried fruit and bean curd")');
                        tx.executeSql('INSERT INTO Categories (CategoryName,Description) VALUES ("Seafood","Seaweed and fish")');
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Categories already exists") === -1) {
                    window.alert("Error 6: " + err.message);
                }
            }
        );
    };
    this.w3InitCustomers = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Customers (CustomerID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,CustomerName NVARCHAR(255),ContactName NVARCHAR(255),Address NVARCHAR(255),City NVARCHAR(255),PostalCode NVARCHAR(255),Country NVARCHAR(255))',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Alfreds Futterkiste","Maria Anders","Obere Str. 57","Berlin","12209","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Ana Trujillo Emparedados y helados","Ana Trujillo","Avda. de la Constituci�n 2222","M�xico D.F.","05021","Mexico")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Antonio Moreno Taquer�a","Antonio Moreno","Mataderos 2312","M�xico D.F.","05023","Mexico")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Around the Horn","Thomas Hardy","120 Hanover Sq.","London","WA1 1DP","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Berglunds snabbk�p","Christina Berglund","Berguvsv�gen 8","Lule�","S-958 22","Sweden")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Blauer See Delikatessen","Hanna Moos","Forsterstr. 57","Mannheim","68306","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Blondel p�re et fils","Fr�d�rique Citeaux","24, place Kl�ber","Strasbourg","67000","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("B�lido Comidas preparadas","Mart�n Sommer","C/ Araquil, 67","Madrid","28023","Spain")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Bon app\'","Laurence Lebihans","12, rue des Bouchers","Marseille","13008","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Bottom-Dollar Marketse","Elizabeth Lincoln","23 Tsawassen Blvd.","Tsawassen","T2F 8M4","Canada")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("B\'s Beverages","Victoria Ashworth","Fauntleroy Circus","London","EC2 5NT","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Cactus Comidas para llevar","Patricio Simpson","Cerrito 333","Buenos Aires","1010","Argentina")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Centro comercial Moctezuma","Francisco Chang","Sierras de Granada 9993","M�xico D.F.","05022","Mexico")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Chop-suey Chinese","Yang Wang","Hauptstr. 29","Bern","3012","Switzerland")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Com�rcio Mineiro","Pedro Afonso","Av. dos Lus�adas, 23","S�o Paulo","05432-043","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Consolidated Holdings","Elizabeth Brown","Berkeley Gardens 12 Brewery ","London","WX1 6LT","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Drachenblut Delikatessend","Sven Ottlieb","Walserweg 21","Aachen","52066","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Du monde entier","Janine Labrune","67, rue des Cinquante Otages","Nantes","44000","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Eastern Connection","Ann Devon","35 King George","London","WX3 6FW","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Ernst Handel","Roland Mendel","Kirchgasse 6","Graz","8010","Austria")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Familia Arquibaldo","Aria Cruz","Rua Or�s, 92","S�o Paulo","05442-030","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("FISSA Fabrica Inter. Salchichas S.A.","Diego Roel","C/ Moralzarzal, 86","Madrid","28034","Spain")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Folies gourmandes","Martine Ranc�","184, chauss�e de Tournai","Lille","59000","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Folk och f� HB","Maria Larsson","�kergatan 24","Br�cke","S-844 67","Sweden")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Frankenversand","Peter Franken","Berliner Platz 43","M�nchen","80805","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("France restauration","Carine Schmitt","54, rue Royale","Nantes","44000","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Franchi S.p.A.","Paolo Accorti","Via Monte Bianco 34","Torino","10100","Italy")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Furia Bacalhau e Frutos do Mar","Lino Rodriguez ","Jardim das rosas n. 32","Lisboa","1675","Portugal")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Galer�a del gastr�nomo","Eduardo Saavedra","Rambla de Catalu�a, 23","Barcelona","08022","Spain")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Godos Cocina T�pica","Jos� Pedro Freyre","C/ Romero, 33","Sevilla","41101","Spain")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Gourmet Lanchonetes","Andr� Fonseca","Av. Brasil, 442","Campinas","04876-786","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Great Lakes Food Market","Howard Snyder","2732 Baker Blvd.","Eugene","97403","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("GROSELLA-Restaurante","Manuel Pereira","5� Ave. Los Palos Grandes","Caracas","1081","Venezuela")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Hanari Carnes","Mario Pontes","Rua do Pa�o, 67","Rio de Janeiro","05454-876","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("HILARI�N-Abastos","Carlos Hern�ndez","Carrera 22 con Ave. Carlos Soublette #8-35","San Crist�bal","5022","Venezuela")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Hungry Coyote Import Store","Yoshi Latimer","City Center Plaza 516 Main St.","Elgin","97827","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Hungry Owl All-Night Grocers","Patricia McKenna","8 Johnstown Road","Cork","","Ireland")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Island Trading","Helen Bennett","Garden House Crowther Way","Cowes","PO31 7PJ","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("K�niglich Essen","Philip Cramer","Maubelstr. 90","Brandenburg","14776","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("La corne d\'abondance","Daniel Tonini","67, avenue de l\'Europe","Versailles","78000","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("La maison d\'Asie","Annette Roulet","1 rue Alsace-Lorraine","Toulouse","31000","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Laughing Bacchus Wine Cellars","Yoshi Tannamuri","1900 Oak St.","Vancouver","V3F 2K1","Canada")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Lazy K Kountry Store","John Steel","12 Orchestra Terrace","Walla Walla","99362","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Lehmanns Marktstand","Renate Messner","Magazinweg 7","Frankfurt a.M. ","60528","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Let\'s Stop N Shop","Jaime Yorres","87 Polk St. Suite 5","San Francisco","94117","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("LILA-Supermercado","Carlos Gonz�lez","Carrera 52 con Ave. Bol�var #65-98 Llano Largo","Barquisimeto","3508","Venezuela")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("LINO-Delicateses","Felipe Izquierdo","Ave. 5 de Mayo Porlamar","I. de Margarita","4980","Venezuela")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Lonesome Pine Restaurant","Fran Wilson","89 Chiaroscuro Rd.","Portland","97219","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Magazzini Alimentari Riuniti","Giovanni Rovelli","Via Ludovico il Moro 22","Bergamo","24100","Italy")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Maison Dewey","Catherine Dewey","Rue Joseph-Bens 532","Bruxelles","B-1180","Belgium")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("M�re Paillarde","Jean Fresni�re","43 rue St. Laurent","Montr�al","H1J 1C3","Canada")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Morgenstern Gesundkost","Alexander Feuer","Heerstr. 22","Leipzig","04179","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("North/South","Simon Crowther","South House 300 Queensbridge","London","SW7 1RZ","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Oc�ano Atl�ntico Ltda.","Yvonne Moncada","Ing. Gustavo Moncada 8585 Piso 20-A","Buenos Aires","1010","Argentina")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Old World Delicatessen","Rene Phillips","2743 Bering St.","Anchorage","99508","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Ottilies K�seladen","Henriette Pfalzheim","Mehrheimerstr. 369","K�ln","50739","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Paris sp�cialit�s","Marie Bertrand","265, boulevard Charonne","Paris","75012","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Pericles Comidas cl�sicas","Guillermo Fern�ndez","Calle Dr. Jorge Cash 321","M�xico D.F.","05033","Mexico")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Piccolo und mehr","Georg Pipps","Geislweg 14","Salzburg","5020","Austria")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Princesa Isabel Vinhoss","Isabel de Castro","Estrada da sa�de n. 58","Lisboa","1756","Portugal")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Que Del�cia","Bernardo Batista","Rua da Panificadora, 12","Rio de Janeiro","02389-673","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Queen Cozinha","L�cia Carvalho","Alameda dos Can�rios, 891","S�o Paulo","05487-020","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("QUICK-Stop","Horst Kloss","Taucherstra�e 10","Cunewalde","01307","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Rancho grande","Sergio Guti�rrez","Av. del Libertador 900","Buenos Aires","1010","Argentina")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Rattlesnake Canyon Grocery","Paula Wilson","2817 Milton Dr.","Albuquerque","87110","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Reggiani Caseifici","Maurizio Moroni","Strada Provinciale 124","Reggio Emilia","42100","Italy")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Ricardo Adocicados","Janete Limeira","Av. Copacabana, 267","Rio de Janeiro","02389-890","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Richter Supermarkt","Michael Holz","Grenzacherweg 237","Gen�ve","1203","Switzerland")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Romero y tomillo","Alejandra Camino","Gran V�a, 1","Madrid","28001","Spain")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Sant� Gourmet","Jonas Bergulfsen","Erling Skakkes gate 78","Stavern","4110","Norway")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Save-a-lot Markets","Jose Pavarotti","187 Suffolk Ln.","Boise","83720","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Seven Seas Imports","Hari Kumar","90 Wadhurst Rd.","London","OX15 4NB","UK")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Simons bistro","Jytte Petersen","Vinb�ltet 34","K�benhavn","1734","Denmark")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Sp�cialit�s du monde","Dominique Perrier","25, rue Lauriston","Paris","75016","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Split Rail Beer & Ale","Art Braunschweiger","P.O. Box 555","Lander","82520","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Supr�mes d�lices","Pascale Cartrain","Boulevard Tirou, 255","Charleroi","B-6000","Belgium")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("The Big Cheese","Liz Nixon","89 Jefferson Way Suite 2","Portland","97201","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("The Cracker Box","Liu Wong","55 Grizzly Peak Rd.","Butte","59801","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Toms Spezialit�ten","Karin Josephs","Luisenstr. 48","M�nster","44087","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Tortuga Restaurante","Miguel Angel Paolino","Avda. Azteca 123","M�xico D.F.","05033","Mexico")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Tradi��o Hipermercados","Anabela Domingues","Av. In�s de Castro, 414","S�o Paulo","05634-030","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Trail\'s Head Gourmet Provisioners","Helvetius Nagy","722 DaVinci Blvd.","Kirkland","98034","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Vaffeljernet","Palle Ibsen","Smagsl�get 45","�rhus","8200","Denmark")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Victuailles en stock","Mary Saveley","2, rue du Commerce","Lyon","69004","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Vins et alcools Chevalier","Paul Henriot","59 rue de l\'Abbaye","Reims","51100","France")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Die Wandernde Kuh","Rita M�ller","Adenauerallee 900","Stuttgart","70563","Germany")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Wartian Herkku","Pirkko Koskitalo","Torikatu 38","Oulu","90110","Finland")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Wellington Importadora","Paula Parente","Rua do Mercado, 12","Resende","08737-363","Brazil")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("White Clover Markets","Karl Jablonski","305 - 14th Ave. S. Suite 3B","Seattle","98128","USA")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Wilman Kala","Matti Karttunen","Keskuskatu 45","Helsinki","21240","Finland")');
                        tx.executeSql('INSERT INTO Customers (CustomerName,ContactName,Address,City,PostalCode,Country) VALUES ("Wolski","Zbyszek","ul. Filtrowa 68","Walla","01-012","Poland")');
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Customers already exists") === -1) {
                    window.alert("Error 7: " + err.message);
                }
            }
        );
    };
    this.w3InitEmployees = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Employees (EmployeeID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,LastName NVARCHAR(255),FirstName NVARCHAR(255),BirthDate DATE,Photo NVARCHAR(255),Notes MEMO)',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Davolio","Nancy","1968-12-08","EmpID1.pic","Education includes a BA in psychology from Colorado State University. She also completed (The Art of the Cold Call). Nancy is a member of \'Toastmasters International\'.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Fuller","Andrew","1952-02-19","EmpID2.pic","Andrew received his BTS commercial and a Ph.D. in international marketing from the University of Dallas. He is fluent in French and Italian and reads German. He joined the company as a sales representative, was promoted to sales manager and was then named vice president of sales. Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Leverling","Janet","1963-08-30","EmpID3.pic","Janet has a BS degree in chemistry from Boston College). She has also completed a certificate program in food retailing management. Janet was hired as a sales associate and was promoted to sales representative.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Peacock","Margaret","1958-09-19","EmpID4.pic","Margaret holds a BA in English literature from Concordia College and an MA from the American Institute of Culinary Arts. She was temporarily assigned to the London office before returning to her permanent post in Seattle.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Buchanan","Steven","1955-03-04","EmpID5.pic","Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree. Upon joining the company as a sales representative, he spent 6 months in an orientation program at the Seattle office and then returned to his permanent post in London, where he was promoted to sales manager. Mr. Buchanan has completed the courses \'Successful Telemarketing\' and \'International Sales Management\'. He is fluent in French.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Suyama","Michael","1963-07-02","EmpID6.pic","Michael is a graduate of Sussex University (MA, economics) and the University of California at Los Angeles (MBA, marketing). He has also taken the courses \'Multi-Cultural Selling\' and \'Time Management for the Sales Professional\'. He is fluent in Japanese and can read and write French, Portuguese, and Spanish.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("King","Robert","1960-05-29","EmpID7.pic","Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan and then joining the company. After completing a course entitled \'Selling in Europe\', he was transferred to the London office.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Callahan","Laura","1958-01-09","EmpID8.pic","Laura received a BA in psychology from the University of Washington. She has also completed a course in business French. She reads and writes French.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("Dodsworth","Anne","1969-07-02","EmpID9.pic","Anne has a BA degree in English from St. Lawrence College. She is fluent in French and German.")');
                        tx.executeSql('INSERT INTO Employees (LastName,FirstName,BirthDate,Photo,Notes) VALUES ("West","Adam","1928-09-19","EmpID10.pic","An old chum.")');
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Employees already exists") === -1) {
                    window.alert("Error 8: " + err.message);
                }
            }
        );
    };
    this.w3InitOrderDetails = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE OrderDetails (OrderDetailID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,OrderID INT,ProductID INT,Quantity INT)',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10248,11,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10248,42,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10248,72,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10249,14,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10249,51,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10250,41,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10250,51,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10250,65,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10251,22,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10251,57,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10251,65,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10252,20,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10252,33,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10252,60,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10253,31,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10253,39,42)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10253,49,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10254,24,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10254,55,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10254,74,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10255,2,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10255,16,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10255,36,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10255,59,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10256,53,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10256,77,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10257,27,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10257,39,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10257,77,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10258,2,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10258,5,65)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10258,32,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10259,21,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10259,37,1)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10260,41,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10260,57,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10260,62,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10260,70,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10261,21,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10261,35,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10262,5,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10262,7,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10262,56,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10263,16,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10263,24,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10263,30,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10263,74,36)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10264,2,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10264,41,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10265,17,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10265,70,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10266,12,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10267,40,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10267,59,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10267,76,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10268,29,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10268,72,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10269,33,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10269,72,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10270,36,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10270,43,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10271,33,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10272,20,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10272,31,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10272,72,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10273,10,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10273,31,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10273,33,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10273,40,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10273,76,33)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10274,71,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10274,72,7)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10275,24,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10275,59,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10276,10,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10276,13,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10277,28,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10277,62,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10278,44,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10278,59,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10278,63,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10278,73,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10279,17,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10280,24,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10280,55,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10280,75,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10281,19,1)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10281,24,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10281,35,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10282,30,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10282,57,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10283,15,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10283,19,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10283,60,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10283,72,3)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10284,27,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10284,44,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10284,60,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10284,67,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10285,1,45)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10285,40,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10285,53,36)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10286,35,100)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10286,62,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10287,16,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10287,34,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10287,46,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10288,54,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10288,68,3)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10289,3,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10289,64,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10290,5,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10290,29,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10290,49,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10290,77,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10291,13,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10291,44,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10291,51,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10292,20,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10293,18,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10293,24,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10293,63,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10293,75,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10294,1,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10294,17,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10294,43,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10294,60,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10294,75,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10295,56,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10296,11,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10296,16,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10296,69,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10297,39,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10297,72,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10298,2,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10298,36,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10298,59,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10298,62,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10299,19,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10299,70,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10300,66,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10300,68,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10301,40,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10301,56,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10302,17,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10302,28,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10302,43,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10303,40,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10303,65,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10303,68,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10304,49,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10304,59,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10304,71,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10305,18,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10305,29,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10305,39,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10306,30,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10306,53,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10306,54,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10307,62,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10307,68,3)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10308,69,1)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10308,70,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10309,4,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10309,6,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10309,42,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10309,43,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10309,71,3)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10310,16,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10310,62,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10311,42,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10311,69,7)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10312,28,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10312,43,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10312,53,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10312,75,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10313,36,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10314,32,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10314,58,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10314,62,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10315,34,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10315,70,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10316,41,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10316,62,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10317,1,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10318,41,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10318,76,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10319,17,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10319,28,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10319,76,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10320,71,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10321,35,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10322,52,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10323,15,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10323,25,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10323,39,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10324,16,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10324,35,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10324,46,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10324,59,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10324,63,80)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10325,6,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10325,13,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10325,14,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10325,31,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10325,72,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10326,4,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10326,57,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10326,75,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10327,2,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10327,11,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10327,30,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10327,58,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10328,59,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10328,65,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10328,68,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10329,19,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10329,30,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10329,38,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10329,56,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10330,26,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10330,72,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10331,54,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10332,18,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10332,42,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10332,47,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10333,14,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10333,21,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10333,71,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10334,52,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10334,68,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10335,2,7)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10335,31,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10335,32,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10335,51,48)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10336,4,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10337,23,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10337,26,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10337,36,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10337,37,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10337,72,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10338,17,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10338,30,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10339,4,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10339,17,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10339,62,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10340,18,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10340,41,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10340,43,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10341,33,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10341,59,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10342,2,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10342,31,56)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10342,36,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10342,55,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10343,64,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10343,68,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10343,76,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10344,4,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10344,8,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10345,8,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10345,19,80)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10345,42,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10346,17,36)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10346,56,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10347,25,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10347,39,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10347,40,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10347,75,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10348,1,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10348,23,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10349,54,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10350,50,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10350,69,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10351,38,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10351,41,13)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10351,44,77)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10351,65,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10352,24,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10352,54,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10353,11,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10353,38,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10354,1,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10354,29,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10355,24,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10355,57,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10356,31,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10356,55,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10356,69,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10357,10,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10357,26,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10357,60,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10358,24,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10358,34,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10358,36,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10359,16,56)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10359,31,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10359,60,80)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10360,28,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10360,29,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10360,38,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10360,49,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10360,54,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10361,39,54)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10361,60,55)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10362,25,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10362,51,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10362,54,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10363,31,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10363,75,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10363,76,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10364,69,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10364,71,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10365,11,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10366,65,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10366,77,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10367,34,36)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10367,54,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10367,65,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10367,77,7)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10368,21,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10368,28,13)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10368,57,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10368,64,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10369,29,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10369,56,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10370,1,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10370,64,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10370,74,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10371,36,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10372,20,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10372,38,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10372,60,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10372,72,42)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10373,58,80)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10373,71,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10374,31,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10374,58,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10375,14,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10375,54,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10376,31,42)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10377,28,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10377,39,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10378,71,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10379,41,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10379,63,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10379,65,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10380,30,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10380,53,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10380,60,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10380,70,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10381,74,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10382,5,32)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10382,18,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10382,29,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10382,33,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10382,74,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10383,13,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10383,50,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10383,56,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10384,20,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10384,60,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10385,7,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10385,60,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10385,68,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10386,24,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10386,34,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10387,24,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10387,28,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10387,59,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10387,71,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10388,45,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10388,52,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10388,53,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10389,10,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10389,55,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10389,62,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10389,70,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10390,31,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10390,35,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10390,46,45)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10390,72,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10391,13,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10392,69,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10393,2,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10393,14,42)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10393,25,7)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10393,26,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10393,31,32)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10394,13,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10394,62,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10395,46,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10395,53,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10395,69,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10396,23,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10396,71,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10396,72,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10397,21,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10397,51,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10398,35,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10398,55,120)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10399,68,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10399,71,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10399,76,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10399,77,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10400,29,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10400,35,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10400,49,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10401,30,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10401,56,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10401,65,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10401,71,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10402,23,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10402,63,65)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10403,16,21)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10403,48,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10404,26,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10404,42,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10404,49,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10405,3,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10406,1,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10406,21,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10406,28,42)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10406,36,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10406,40,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10407,11,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10407,69,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10407,71,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10408,37,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10408,54,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10408,62,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10409,14,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10409,21,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10410,33,49)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10410,59,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10411,41,25)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10411,44,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10411,59,9)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10412,14,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10413,1,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10413,62,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10413,76,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10414,19,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10414,33,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10415,17,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10415,33,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10416,19,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10416,53,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10416,57,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10417,38,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10417,46,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10417,68,36)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10417,77,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10418,2,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10418,47,55)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10418,61,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10418,74,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10419,60,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10419,69,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10420,9,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10420,13,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10420,70,8)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10420,73,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10421,19,4)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10421,26,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10421,53,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10421,77,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10422,26,2)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10423,31,14)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10423,59,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10424,35,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10424,38,49)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10424,68,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10425,55,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10425,76,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10426,56,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10426,64,7)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10427,14,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10428,46,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10429,50,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10429,63,35)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10430,17,45)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10430,21,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10430,56,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10430,59,70)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10431,17,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10431,40,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10431,47,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10432,26,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10432,54,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10433,56,28)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10434,11,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10434,76,18)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10435,2,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10435,22,12)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10435,72,10)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10436,46,5)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10436,56,40)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10436,64,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10436,75,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10437,53,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10438,19,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10438,34,20)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10438,57,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10439,12,15)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10439,16,16)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10439,64,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10439,74,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10440,2,45)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10440,16,49)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10440,29,24)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10440,61,90)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10441,27,50)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10442,11,30)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10442,54,80)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10442,66,60)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10443,11,6)');
                        tx.executeSql('INSERT INTO OrderDetails (OrderID,ProductID,Quantity) VALUES (10443,28,12)');
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("OrderDetails already exists") === -1) {
                    window.alert("Error 9: " + err.message);
                }
            }
        );
    };
    this.w3InitOrders = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Orders (OrderID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,CustomerID INT,EmployeeID INT,OrderDate DATE,ShipperID INT)',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10248,90,5,"1996-07-04",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10249,81,6,"1996-07-05",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10250,34,4,"1996-07-08",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10251,84,3,"1996-07-08",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10252,76,4,"1996-07-09",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10253,34,3,"1996-07-10",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10254,14,5,"1996-07-11",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10255,68,9,"1996-07-12",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10256,88,3,"1996-07-15",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10257,35,4,"1996-07-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10258,20,1,"1996-07-17",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10259,13,4,"1996-07-18",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10260,55,4,"1996-07-19",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10261,61,4,"1996-07-19",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10262,65,8,"1996-07-22",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10263,20,9,"1996-07-23",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10264,24,6,"1996-07-24",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10265,7,2,"1996-07-25",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10266,87,3,"1996-07-26",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10267,25,4,"1996-07-29",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10268,33,8,"1996-07-30",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10269,89,5,"1996-07-31",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10270,87,1,"1996-08-01",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10271,75,6,"1996-08-01",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10272,65,6,"1996-08-02",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10273,63,3,"1996-08-05",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10274,85,6,"1996-08-06",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10275,49,1,"1996-08-07",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10276,80,8,"1996-08-08",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10277,52,2,"1996-08-09",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10278,5,8,"1996-08-12",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10279,44,8,"1996-08-13",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10280,5,2,"1996-08-14",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10281,69,4,"1996-08-14",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10282,69,4,"1996-08-15",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10283,46,3,"1996-08-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10284,44,4,"1996-08-19",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10285,63,1,"1996-08-20",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10286,63,8,"1996-08-21",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10287,67,8,"1996-08-22",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10288,66,4,"1996-08-23",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10289,11,7,"1996-08-26",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10290,15,8,"1996-08-27",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10291,61,6,"1996-08-27",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10292,81,1,"1996-08-28",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10293,80,1,"1996-08-29",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10294,65,4,"1996-08-30",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10295,85,2,"1996-09-02",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10296,46,6,"1996-09-03",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10297,7,5,"1996-09-04",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10298,37,6,"1996-09-05",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10299,67,4,"1996-09-06",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10300,49,2,"1996-09-09",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10301,86,8,"1996-09-09",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10302,76,4,"1996-09-10",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10303,30,7,"1996-09-11",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10304,80,1,"1996-09-12",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10305,55,8,"1996-09-13",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10306,69,1,"1996-09-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10307,48,2,"1996-09-17",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10308,2,7,"1996-09-18",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10309,37,3,"1996-09-19",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10310,77,8,"1996-09-20",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10311,18,1,"1996-09-20",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10312,86,2,"1996-09-23",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10313,63,2,"1996-09-24",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10314,65,1,"1996-09-25",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10315,38,4,"1996-09-26",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10316,65,1,"1996-09-27",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10317,48,6,"1996-09-30",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10318,38,8,"1996-10-01",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10319,80,7,"1996-10-02",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10320,87,5,"1996-10-03",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10321,38,3,"1996-10-03",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10322,58,7,"1996-10-04",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10323,39,4,"1996-10-07",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10324,71,9,"1996-10-08",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10325,39,1,"1996-10-09",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10326,8,4,"1996-10-10",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10327,24,2,"1996-10-11",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10328,28,4,"1996-10-14",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10329,75,4,"1996-10-15",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10330,46,3,"1996-10-16",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10331,9,9,"1996-10-16",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10332,51,3,"1996-10-17",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10333,87,5,"1996-10-18",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10334,84,8,"1996-10-21",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10335,37,7,"1996-10-22",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10336,60,7,"1996-10-23",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10337,25,4,"1996-10-24",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10338,55,4,"1996-10-25",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10339,51,2,"1996-10-28",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10340,9,1,"1996-10-29",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10341,73,7,"1996-10-29",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10342,25,4,"1996-10-30",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10343,44,4,"1996-10-31",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10344,89,4,"1996-11-01",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10345,63,2,"1996-11-04",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10346,65,3,"1996-11-05",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10347,21,4,"1996-11-06",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10348,86,4,"1996-11-07",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10349,75,7,"1996-11-08",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10350,41,6,"1996-11-11",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10351,20,1,"1996-11-11",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10352,28,3,"1996-11-12",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10353,59,7,"1996-11-13",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10354,58,8,"1996-11-14",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10355,4,6,"1996-11-15",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10356,86,6,"1996-11-18",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10357,46,1,"1996-11-19",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10358,41,5,"1996-11-20",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10359,72,5,"1996-11-21",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10360,7,4,"1996-11-22",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10361,63,1,"1996-11-22",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10362,9,3,"1996-11-25",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10363,17,4,"1996-11-26",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10364,19,1,"1996-11-26",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10365,3,3,"1996-11-27",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10366,29,8,"1996-11-28",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10367,83,7,"1996-11-28",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10368,20,2,"1996-11-29",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10369,75,8,"1996-12-02",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10370,14,6,"1996-12-03",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10371,41,1,"1996-12-03",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10372,62,5,"1996-12-04",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10373,37,4,"1996-12-05",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10374,91,1,"1996-12-05",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10375,36,3,"1996-12-06",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10376,51,1,"1996-12-09",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10377,72,1,"1996-12-09",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10378,24,5,"1996-12-10",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10379,61,2,"1996-12-11",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10380,37,8,"1996-12-12",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10381,46,3,"1996-12-12",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10382,20,4,"1996-12-13",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10383,4,8,"1996-12-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10384,5,3,"1996-12-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10385,75,1,"1996-12-17",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10386,21,9,"1996-12-18",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10387,70,1,"1996-12-18",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10388,72,2,"1996-12-19",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10389,10,4,"1996-12-20",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10390,20,6,"1996-12-23",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10391,17,3,"1996-12-23",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10392,59,2,"1996-12-24",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10393,71,1,"1996-12-25",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10394,36,1,"1996-12-25",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10395,35,6,"1996-12-26",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10396,25,1,"1996-12-27",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10397,60,5,"1996-12-27",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10398,71,2,"1996-12-30",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10399,83,8,"1996-12-31",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10400,19,1,"1997-01-01",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10401,65,1,"1997-01-01",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10402,20,8,"1997-01-02",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10403,20,4,"1997-01-03",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10404,49,2,"1997-01-03",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10405,47,1,"1997-01-06",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10406,62,7,"1997-01-07",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10407,56,2,"1997-01-07",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10408,23,8,"1997-01-08",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10409,54,3,"1997-01-09",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10410,10,3,"1997-01-10",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10411,10,9,"1997-01-10",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10412,87,8,"1997-01-13",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10413,41,3,"1997-01-14",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10414,21,2,"1997-01-14",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10415,36,3,"1997-01-15",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10416,87,8,"1997-01-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10417,73,4,"1997-01-16",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10418,63,4,"1997-01-17",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10419,68,4,"1997-01-20",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10420,88,3,"1997-01-21",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10421,61,8,"1997-01-21",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10422,27,2,"1997-01-22",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10423,31,6,"1997-01-23",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10424,51,7,"1997-01-23",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10425,41,6,"1997-01-24",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10426,29,4,"1997-01-27",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10427,59,4,"1997-01-27",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10428,66,7,"1997-01-28",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10429,37,3,"1997-01-29",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10430,20,4,"1997-01-30",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10431,10,4,"1997-01-30",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10432,75,3,"1997-01-31",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10433,60,3,"1997-02-03",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10434,24,3,"1997-02-03",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10435,16,8,"1997-02-04",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10436,7,3,"1997-02-05",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10437,87,8,"1997-02-05",1)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10438,79,3,"1997-02-06",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10439,51,6,"1997-02-07",3)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10440,71,4,"1997-02-10",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10441,55,3,"1997-02-10",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10442,20,3,"1997-02-11",2)');
                        tx.executeSql('INSERT INTO Orders (OrderID,CustomerID,EmployeeID,OrderDate,ShipperID) VALUES (10443,66,8,"1997-02-12",1)');
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Orders already exists") === -1) {
                    window.alert("Error 10: " + err.message);
                }
            }
        );
    };
    this.w3InitProducts = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Products (ProductID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,ProductName NVARCHAR(255),SupplierID INT,CategoryID INT,Unit NVARCHAR(255),Price MONEY)',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (1,"Chais",1,1,"10 boxes x 20 bags",18)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (2,"Chang",1,1,"24 - 12 oz bottles",19)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (3,"Aniseed Syrup",1,2,"12 - 550 ml bottles",10)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (4,"Chef Anton\'s Cajun Seasoning",2,2,"48 - 6 oz jars",22)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (5,"Chef Anton\'s Gumbo Mix",2,2,"36 boxes",21.35)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (6,"Grandma\'s Boysenberry Spread",3,2,"12 - 8 oz jars",25)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (7,"Uncle Bob\'s Organic Dried Pears",3,7,"12 - 1 lb pkgs.",30)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (8,"Northwoods Cranberry Sauce",3,2,"12 - 12 oz jars",40)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (9,"Mishi Kobe Niku",4,6,"18 - 500 g pkgs.",97)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (10,"Ikura",4,8,"12 - 200 ml jars",31)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (11,"Queso Cabrales",5,4,"1 kg pkg.",21)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (12,"Queso Manchego La Pastora",5,4,"10 - 500 g pkgs.",38)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (13,"Konbu",6,8,"2 kg box",6)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (14,"Tofu",6,7,"40 - 100 g pkgs.",23.25)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (15,"Genen Shouyu",6,2,"24 - 250 ml bottles",15.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (16,"Pavlova",7,3,"32 - 500 g boxes",17.45)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (17,"Alice Mutton",7,6,"20 - 1 kg tins",39)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (18,"Carnarvon Tigers",7,8,"16 kg pkg.",62.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (19,"Teatime Chocolate Biscuits",8,3,"10 boxes x 12 pieces",9.2)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (20,"Sir Rodney\'s Marmalade",8,3,"30 gift boxes",81)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (21,"Sir Rodney\'s Scones",8,3,"24 pkgs. x 4 pieces",10)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (22,"Gustaf\'s Kn�ckebr�d",9,5,"24 - 500 g pkgs.",21)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (23,"Tunnbr�d",9,5,"12 - 250 g pkgs.",9)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (24,"Guaran� Fant�stica",10,1,"12 - 355 ml cans",4.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (25,"NuNuCa Nu�-Nougat-Creme",11,3,"20 - 450 g glasses",14)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (26,"Gumb�r Gummib�rchen",11,3,"100 - 250 g bags",31.23)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (27,"Schoggi Schokolade",11,3,"100 - 100 g pieces",43.9)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (28,"R�ssle Sauerkraut",12,7,"25 - 825 g cans",45.6)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (29,"Th�ringer Rostbratwurst",12,6,"50 bags x 30 sausgs.",123.79)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (30,"Nord-Ost Matjeshering",13,8,"10 - 200 g glasses",25.89)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (31,"Gorgonzola Telino",14,4,"12 - 100 g pkgs",12.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (32,"Mascarpone Fabioli",14,4,"24 - 200 g pkgs.",32)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (33,"Geitost",15,4,"500 g",2.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (34,"Sasquatch Ale",16,1,"24 - 12 oz bottles",14)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (35,"Steeleye Stout",16,1,"24 - 12 oz bottles",18)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (36,"Inlagd Sill",17,8,"24 - 250 g jars",19)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (37,"Gravad lax",17,8,"12 - 500 g pkgs.",26)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (38,"C�te de Blaye",18,1,"12 - 75 cl bottles",263.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (39,"Chartreuse verte",18,1,"750 cc per bottle",18)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (40,"Boston Crab Meat",19,8,"24 - 4 oz tins",18.4)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (41,"Jack\'s New England Clam Chowder",19,8,"12 - 12 oz cans",9.65)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (42,"Singaporean Hokkien Fried Mee",20,5,"32 - 1 kg pkgs.",14)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (43,"Ipoh Coffee",20,1,"16 - 500 g tins",46)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (44,"Gula Malacca",20,2,"20 - 2 kg bags",19.45)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (45,"R�gede sild",21,8,"1k pkg.",9.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (46,"Spegesild",21,8,"4 - 450 g glasses",12)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (47,"Zaanse koeken",22,3,"10 - 4 oz boxes",9.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (48,"Chocolade",22,3,"10 pkgs.",12.75)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (49,"Maxilaku",23,3,"24 - 50 g pkgs.",20)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (50,"Valkoinen suklaa",23,3,"12 - 100 g bars",16.25)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (51,"Manjimup Dried Apples",24,7,"50 - 300 g pkgs.",53)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (52,"Filo Mix",24,5,"16 - 2 kg boxes",7)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (53,"Perth Pasties",24,6,"48 pieces",32.8)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (54,"Tourti�re",25,6,"16 pies",7.45)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (55,"P�t� chinois",25,6,"24 boxes x 2 pies",24)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (56,"Gnocchi di nonna Alice",26,5,"24 - 250 g pkgs.",38)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (57,"Ravioli Angelo",26,5,"24 - 250 g pkgs.",19.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (58,"Escargots de Bourgogne",27,8,"24 pieces",13.25)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (59,"Raclette Courdavault",28,4,"5 kg pkg.",55)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (60,"Camembert Pierrot",28,4,"15 - 300 g rounds",34)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (61,"Sirop d\'�rable",29,2,"24 - 500 ml bottles",28.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (62,"Tarte au sucre",29,3,"48 pies",49.3)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (63,"Vegie-spread",7,2,"15 - 625 g jars",43.9)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (64,"Wimmers gute Semmelkn�del",12,5,"20 bags x 4 pieces",33.25)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (65,"Louisiana Fiery Hot Pepper Sauce",2,2,"32 - 8 oz bottles",21.05)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (66,"Louisiana Hot Spiced Okra",2,2,"24 - 8 oz jars",17)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (67,"Laughing Lumberjack Lager",16,1,"24 - 12 oz bottles",14)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (68,"Scottish Longbreads",8,3,"10 boxes x 8 pieces",12.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (69,"Gudbrandsdalsost",15,4,"10 kg pkg.",36)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (70,"Outback Lager",7,1,"24 - 355 ml bottles",15)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (71,"Fl�temysost",15,4,"10 - 500 g pkgs.",21.5)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (72,"Mozzarella di Giovanni",14,4,"24 - 200 g pkgs.",34.8)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (73,"R�d Kaviar",17,8,"24 - 150 g jars",15)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (74,"Longlife Tofu",4,7,"5 kg pkg.",10)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (75,"Rh�nbr�u Klosterbier",12,1,"24 - 0.5 l bottles",7.75)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (76,"Lakkalik��ri",23,1,"500 ml ",18)');
                        tx.executeSql('INSERT INTO Products (ProductID,ProductName,SupplierID,CategoryID,Unit,Price) VALUES (77,"Original Frankfurter gr�ne So�e",12,2,"12 boxes",13)');
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Products already exists") === -1) {
                    window.alert("Error 11: " + err.message);
                }
            }
        );
    };
    this.w3InitShippers = function() {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Shippers (ShipperID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,ShipperName NVARCHAR(255),Phone NVARCHAR(255))',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Shippers (ShipperID,ShipperName,Phone) VALUES (1,"Speedy Express","(503) 555-9831")'); 
                        tx.executeSql('INSERT INTO Shippers (ShipperID,ShipperName,Phone) VALUES (2,"United Package","(503) 555-3199")'); 
                        tx.executeSql('INSERT INTO Shippers (ShipperID,ShipperName,Phone) VALUES (3,"Federal Shipping","(503) 555-9931")'); 
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Shippers already exists") === -1) {
                    window.alert("Error 12: " + err.message);
                }
            }
        );
    };
    this.w3InitSuppliers = function(n) {
        w3Database.transaction(function (tx)
            {
                tx.executeSql('CREATE TABLE Suppliers (SupplierID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,SupplierName NVARCHAR(255),ContactName NVARCHAR(255),Address NVARCHAR(255),City NVARCHAR(255),PostalCode NVARCHAR(255),Country NVARCHAR(255),Phone NVARCHAR(255))',[], function(tx)
                    {
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (1,"Exotic Liquid","Charlotte Cooper","49 Gilbert St.","Londona","EC1 4SD","UK","(171) 555-2222")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (2,"New Orleans Cajun Delights","Shelley Burke","P.O. Box 78934","New Orleans","70117","USA","(100) 555-4822")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (3,"Grandma Kelly\'s Homestead","Regina Murphy","707 Oxford Rd.","Ann Arbor","48104","USA","(313) 555-5735")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (4,"Tokyo Traders","Yoshi Nagase","9-8 Sekimai Musashino-shi","Tokyo","100","Japan","(03) 3555-5011")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (5,"Cooperativa de Quesos \'Las Cabras\'","Antonio del Valle Saavedra ","Calle del Rosal 4","Oviedo","33007","Spain","(98) 598 76 54")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (6,"Mayumi\'s","Mayumi Ohno","92 Setsuko Chuo-ku","Osaka","545","Japan","(06) 431-7877")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (7,"Pavlova, Ltd.","Ian Devling","74 Rose St. Moonie Ponds","Melbourne","3058","Australia","(03) 444-2343")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (8,"Specialty Biscuits, Ltd.","Peter Wilson","29 King\'s Way","Manchester","M14 GSD","UK","(161) 555-4448")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (9,"PB Kn�ckebr�d AB","Lars Peterson","Kaloadagatan 13","G�teborg","S-345 67","Sweden ","031-987 65 43")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (10,"Refrescos Americanas LTDA","Carlos Diaz","Av. das Americanas 12.890","S�o Paulo","5442","Brazil","(11) 555 4640")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (11,"Heli S��waren GmbH &amp; Co. KG","Petra Winkler","Tiergartenstra�e 5","Berlin","10785","Germany","(010) 9984510")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (12,"Plutzer Lebensmittelgro�m�rkte AG","Martin Bein","Bogenallee 51","Frankfurt","60439","Germany","(069) 992755")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (13,"Nord-Ost-Fisch Handelsgesellschaft mbH","Sven Petersen","Frahmredder 112a","Cuxhaven","27478","Germany","(04721) 8713")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (14,"Formaggi Fortini s.r.l.","Elio Rossi","Viale Dante, 75","Ravenna","48100","Italy","(0544) 60323")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (15,"Norske Meierier","Beate Vileid","Hatlevegen 5","Sandvika","1320","Norway","(0)2-953010")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (16,"Bigfoot Breweries","Cheryl Saylor","3400 - 8th Avenue Suite 210","Bend","97101","USA","(503) 555-9931")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (17,"Svensk Sj�f�da AB","Michael Bj�rn","Brovallav�gen 231","Stockholm","S-123 45","Sweden","08-123 45 67")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (18,"Aux joyeux eccl�siastiques","Guyl�ne Nodier","203, Rue des Francs-Bourgeois","Paris","75004","France","(1) 03.83.00.68")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (19,"New England Seafood Cannery","Robb Merchant","Order Processing Dept. 2100 Paul Revere Blvd.","Boston","02134","USA","(617) 555-3267")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (20,"Leka Trading","Chandra Leka","471 Serangoon Loop, Suite #402","Singapore","0512","Singapore","555-8787")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (21,"Lyngbysild","Niels Petersen","Lyngbysild Fiskebakken 10","Lyngby","2800","Denmark","43844108")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (22,"Zaanse Snoepfabriek","Dirk Luchte","Verkoop Rijnweg 22","Zaandam","9999 ZZ","Netherlands","(12345) 1212")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (23,"Karkki Oy","Anne Heikkonen","Valtakatu 12","Lappeenranta","53120","Finland","(953) 10956")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (24,"G\'day, Mate","Wendy Mackenzie","170 Prince Edward Parade Hunter\'s Hill","Sydney","2042","Australia","(02) 555-5914")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (25,"Ma Maison","Jean-Guy Lauzon","2960 Rue St. Laurent","Montr�al","H1J 1C3","Canada","(514) 555-9022")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (26,"Pasta Buttini s.r.l.","Giovanni Giudici","Via dei Gelsomini, 153","Salerno","84100","Italy","(089) 6547665")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (27,"Escargots Nouveaux","Marie Delamare","22, rue H. Voiron","Montceau","71300","France","85.57.00.07")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (28,"Gai p�turage","Eliane Noz","Bat. B 3, rue des Alpes","Annecy","74000","France","38.76.98.06")'); 
                        tx.executeSql('INSERT INTO Suppliers (SupplierID,SupplierName,ContactName,Address,City,PostalCode,Country,Phone) VALUES (29,"For�ts d\'�rables","Chantal Goulet","148 rue Chasseur","Ste-Hyacinthe","J2S 7S8","Canada","(514) 555-2955")',[], function(tx)
                            {
                                var sql = document.getElementById("textareaCodeSQL").value;
                                if (n === 0) {
                                    w3DBObj.w3ExecuteSQL(sql);
                                } else {
                                    document.getElementById("divResultSQL").innerHTML = "<div style='margin:10px;'>The database is fully restored.</div>";
                                }
                                w3DBObj.myDatabase();
                            }
                        ); 
                    }
                );
            }
            ,function (err) {
                if (err.message.indexOf("Suppliers already exists") === -1) {
                    window.alert("Error 13: " + err.message);
                }
            }
        );
    };
    this.runSQL = function(n) {
        w3Database.transaction(function (tx)
            {
                tx.executeSql("SELECT * FROM sqlite_sequence",[],function ()
                    {
                    var sql = document.getElementById("textareaCodeSQL").value;
                    w3DBObj.w3ExecuteSQL(sql);
                    }
                );
            }
            ,function (err) {
                w3DBObj.w3InitDatabase(0);
            }
        );
    };
    
}