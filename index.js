console.log("Jai Balaji");
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})
import fs from 'fs';
import axios from "axios";
import createPdf from './createPdf.js';

try {

    const FunMain = async () => {


        const firstPageRes = await axios.get('https://api.vistarooms.com/api/v2/property-list?page=1', {
            headers: {
                'apiKey': process.env.apiKey,
                'secretKey': process.env.secretKey
            }
        });
        const firstpageDataofPagination = firstPageRes.data.response.pagination;

        const { total_pages, total,per_page,current_page } = firstpageDataofPagination;
        let FilterDataPararmetrs = [];
        console.log("Imp: ",firstpageDataofPagination)
        //console.log(firstpageDataofPagination);

        //  const FunCallApi=async()=>{



        //  }
        for (let i = 1; i <= total_pages; ++i) {
            let arr = [];
            try {
                const page = await axios.get(`https://api.vistarooms.com/api/v2/property-list?page=${i}`, {
                    headers: {
                        'apiKey': '217B8-8E4F7',
                        'secretKey': '5ddce5954fdbd9cd40a54babbf93a3624b784bce'
                    }
                });
                const pageData = page.data
                arr = pageData.response.data;
            } catch (error) {

                console.log(`"error in loop no ${i} : "`, error);
            }
            

            function findAndUpdate(amenitieType, updatedRes) {
                let found = false;
                arr.forEach(obj => {
                    if (obj.amenitieType === amenitieType) {
                        obj.res = updatedRes;
                        found = true;
                    }
                });
                return found;
            }
            for (let property of arr) {

                //travel amenitiesArr
                const amenitiesArr = property.amenities;
                //console.log(amenitiesArr);

             
                for (let amenitie of amenitiesArr) {
                 const findDataObj=FilterDataPararmetrs.find(item => item.amenitieType == amenitie.name);
                    if (!findDataObj) {
                        //not FOund
                        let obj={
                            amenitieType:amenitie.name,
                            res:[amenitie.value]
                        }
                        FilterDataPararmetrs.push(obj);
                    }
                    else{
                         
                       if(!FilterDataPararmetrs.find(item => item.amenitieType == amenitie.name).res.includes(amenitie.value)){
                        FilterDataPararmetrs.find(item => item.amenitieType == amenitie.name).res.push(amenitie.value);
                       }
                      
                    }

                }
            }
              console.log("Size Of FilterData amenities ", FilterDataPararmetrs.length);
        }

        console.log(FilterDataPararmetrs);





        const title = "All Amenitie From StayVista Production";
        const description = `All Unique parameters after scanning all API\nTotal No of Propeties Scan :${total} and Total pages: ${total_pages}\n`;

       
 
        createPdf(title, description, FilterDataPararmetrs)
            .then(pdfBytes => {
                
                const pdfFileName = `${title}.pdf`;
                fs.writeFileSync(pdfFileName, pdfBytes);
                console.log(`PDF "${pdfFileName}" created and saved successfully.`);
            })
            .catch(error => {
                console.error("Error creating PDF x x x :", error);

            })



    }
    FunMain();

} catch (error) {
    console.log('Error in main Fun ', error)
}