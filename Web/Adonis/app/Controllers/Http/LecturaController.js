'use strict'

const Lectura = use('App/Models/Lectura');

const MysqlLectura = use('App/Models/MysqlLectura');

const Promedio = use('App/Models/Promedio');

class LecturaController {


    // call conection
    async mongoDBConnect(){

        try {
            // to Atlas
            await Lectura.mongoose.connect('mongodb+srv://Anioah:anioah123@act1-m5bsf.mongodb.net/proyecto_mzz?retryWrites=true&w=majority', {useNewUrlParser: true, useMongoClient: true, useUnifiedTopology: true});
        } catch (error) { } 

       /* try {
            // to local
            await Lectura.mongoose.connect('mongodb://127.0.0.1:27017/proyecto_mzz', {useNewUrlParser: true, useMongoClient: true, useUnifiedTopology: true, connectTimeoutMS: 5000});
        } catch (error) { } */
            
    }

    // end conection
    async closeConection(){
      await Lectura.mongoose.connection.close();
    }

    async store({request,response}){

      await this.closeConection();

      await this.mongoDBConnect();
  
      const data = await request.all();

      let getIdentificador = await Lectura.lecturaMongo.countDocuments();

      try {
        let lectura = await Lectura.lecturaMongo.create({
            "_id" : new Lectura.mongoose.Types.ObjectId(),
            "temperatura" : data.temperatura,
            "humedad" : data.humedad,
            "latitud" : data.latitud,
            "longitud" : data.longitud,
            "fecha": Date.now(),
            "identificador" : getIdentificador
          });

        return response.status(200).json({
            status:'OK',
            message:'Recopilación de datos guardada exitosamente',
            data:{
                lectura: lectura
            }
          });   
      } catch (error) {
          return response.status(400).json({message: "Recopilación de datos no exitosa, intente nuevamente"})
      }

    }

    async show({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {
            const lecturas = await Lectura.lecturaMongo.find().sort({"fecha":-1});
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
        
    }

    async showPerTemperatures({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {
            const lecturas = await Lectura.lecturaMongo.find({"temperatura": { $gte: data.temperatura, $lte: data.temperatura + .99  }}).sort({"fecha":-1});

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async showPerHumedity({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {         
        const lecturas = await Lectura.lecturaMongo.find({"humedad" : { $gte: data.humedad, $lte: data.humedad + .99  }}).sort({"fecha":-1});

        if(lecturas == ""){
            return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
        }
        return response.status(200).json(lecturas);
   
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
    }

    async showPerPresion({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {
            const lecturas = await Lectura.lecturaMongo.find({"presion": { $gte: data.presion, $lte: data.presion + .99 }}).sort({"fecha":-1});

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async showPerDate({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        var fecha1 = data.year + "/" + data.month + "/" + data.day;
        var fecha2 = data.year + "/" + data.month + "/" +(data.day + 1);

        try {
            const lecturas = await Lectura.lecturaMongo.find({"fecha": {$gte: new Date(fecha1), $lte: new Date(fecha2)} }).sort({"fecha":-1});

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async showBetweenDates({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {
            const lecturas = await Lectura.lecturaMongo.find({fecha: { $gte: new Date(data.fecha1), $lte: new Date(data.fecha2) }}).sort({"fecha":-1});

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async update({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {
            const ident = await Lectura.lecturaMongo.find({_id: Lectura.mongoose.Types.ObjectId(data._id)})

            var identificador
    
            for(let i = 0; i < ident.length; i ++){
                identificador = ident[i]
            }
    
            await Lectura.lecturaMongo.update({_id: Lectura.mongoose.Types.ObjectId(data._id)},{$set:{
                "temperatura": data.temperatura,
                "humedad" : data.humedad,
                "latitud" : data.latitud,
                "longitud" : data.longitud,
                "fecha": data.fecha,
                "identificador": identificador.identificador
                }
            })
    
            const newLectura = await Lectura.lecturaMongo.find({_id: Lectura.mongoose.Types.ObjectId(data._id)})
    
            return response.status(200).json({data: "Lectura actualizada correctamente" , "lectura" : newLectura });
        } catch (error) {
            return response.status(400).json({message: "Actualización no realizada, verifique los parámetros de entrada"});
        }


    }

    async delete({request,response}){

        await this.closeConection();

        await this.mongoDBConnect();

        const data = await request.all();

        try {
            return await Lectura.lecturaMongo.findOneAndRemove({"_id": Lectura.mongoose.Types.ObjectId(data._id)});;
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
       
    }

    async makePromedio({response}){

        await this.mongoDBConnect();
    
    
        const promedio = new Promedio()
    
        try {
            const promTemp = await Lectura.lecturaMongo.aggregate([
                {$sort: {"fecha": -1}},
                {$limit: 5},
               {$group: { _id: null , "Promedio" : { $avg: "$temperatura" }} }
            ])
        
            const promHum = await Lectura.lecturaMongo.aggregate([
                {$sort: {"fecha": -1}},
                {$limit: 5},
               {$group: { _id: null , "Promedio" : { $avg: "$humedad"}} }
            ])
    
            const promPres = await Lectura.lecturaMongo.aggregate([
                {$sort: {"fecha": -1}},
                {$limit: 5},
               {$project: {_id: null,  "Promedio" : { $avg: "$presion" }} }
            ])
        
            // Extrayendo promedio de ArrayObject
        
            var temp, hum, presion;
        
            for (let index = 0; index < promTemp.length; index++) {
                const element = promTemp[index];
        
                temp = element.Promedio
            }
        
            for (let index = 0; index < promHum.length; index++) {
                const element = promHum[index];
        
                hum = element.Promedio
            }
    
            for (let index = 0; index < promPres.length; index++){
                const element = promPres[index];
    
                presion = element.Promedio
            }
        
            // Mandando datos a MYSQL
        
            promedio.prom_temperatura = temp
            promedio.prom_humedad = hum
            promedio.prom_presion = presion
        
            await promedio.save()
        
            return response.status(200).json(promedio)

        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
    
    }


    async getAverage({request,response}){
        try {
            var promedio = [await Promedio.last()];
            return response.status(200).json(promedio);   
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async getLecture({}){
        try {
            await this.mongoDBConnect();
            return await Lectura.lecturaMongo.find().sort({"fecha":-1}).limit(1);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    
    }

    // Mysql Alternative

    async newMysqlLecture({request,response}){

        var lectura = request.all();

        try {
            const {temperatura, humedad, latitud, longitud} = request.only([
                'temperatura',
                'humedad',
                'latitud',
                'longitud'
            ]);
            
            await MysqlLectura.create({
                temperatura,
                humedad,
                latitud,
                longitud
            })
    
            return response.status(200).json({
                status:'OK',
                message:'Recopilación de datos guardada exitosamente',
                data:{
                    "lectura": lectura
                }
            });   
        } catch (error) {
              return response.status(400).json({message: "Recopilación de datos no exitosa, intente nuevamente"})
            }

    }

    async showMysql({request,response}){
        try {
            var lectura = await MysqlLectura.query().select('mysql_lecturas.*').orderBy('id', 'desc').fetch();
            return response.status(200).json(lectura);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
    }

    async getMysqlLecture({request,response}){
        try {
            var lectura = [await MysqlLectura.last()];
            return response.status(200).json(lectura);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
    }

    async deleteMysql({request,response}){

        const data = await request.all();

        const lectura = await MysqlLectura.find(data.id);

        await MysqlLectura.query().where('id',data.id).delete();

        try {
            return response.status(200).json({message: "Lectura borrada correctamente", lectura});
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
       
    }

    async mysqlPerTemperatures({request,response}){

        const data = await request.all();
        const temp2 = data.temperatura + .99;

        try {
            const lecturas = await MysqlLectura.query().whereBetween("temperatura", [data.temperatura,temp2] ).orderBy('id', 'desc').fetch();

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async mysqlPerHumedity({request,response}){

        const data = await request.all();
        const hum2 = data.humedad + .99;

        try {
            const lecturas = await MysqlLectura.query().whereBetween("humedad", [data.humedad,hum2] ).orderBy('id', 'desc').fetch();

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async mysqlPerDate({request,response}){

        const data = await request.all();

        var fecha1 = data.year + "/" + data.month + "/" + data.day;
        var fecha2 = data.year + "/" + data.month + "/" +(data.day + 1);

        try {
            const lecturas = await MysqlLectura.query().whereBetween('created_at',[fecha1,fecha2]).orderBy('id','desc').fetch();

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async mysqlBetweenDates({request,response}){

        const data = await request.all();

        try {
            const lecturas = await MysqlLectura.query().whereBetween('created_at',[fecha1,fecha2]).orderBy('id','desc').fetch();

            if(lecturas == ""){
                return response.status(200).json({message: "No hay registros con ese parámetro de búsqueda"});
            }
            return response.status(200).json(lecturas);
        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }

    }

    async mysqlMakePromedio({response}){

        const promedio = new Promedio();

        var temp, hum;
    
        try {
            
            let promTemp = await MysqlLectura.query().orderBy('id','desc').limit(5).getAvg("temperatura");
            let promHum = await MysqlLectura.query().orderBy('id','desc').limit(5).getAvg("humedad");
   
            // Mandando datos a MYSQL

            temp = promTemp;
            hum = promHum;

            promedio.prom_temperatura = temp
            promedio.prom_humedad = hum
        
            await promedio.save()
        
            return response.status(200).json(promedio)

        } catch (error) {
            return response.status(400).json({message: "No fue procesada la operación de manera satisfactoria, intente nuevamente"});
        }
    
    }


}

module.exports = LecturaController
