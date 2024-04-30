//import express
const express = require('express'); 

//import axios
const axios = require ('axios');

//import JSDOM
const jsdom = require('jsdom')
const { JSDOM } = jsdom;


const app = express(); 

//set the port for express
const PORT = 3001; 

//create a get route for /api/scrape
app.get('/api/scrape', async(req, res)=>{ 

	//check of keyword is present in the request query
	if (req.query.keyword) {

		//an array that will house the parsed products
		let data = []

			//perform an axios get request to Amazon website using the keyword parameter
			try {
				const response = await axios.get(`https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=${req.query.keyword}&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309`, {headers:{"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"}});
				const dom = new JSDOM(response.data);
				dom.window.document.querySelectorAll('.s-result-item.s-asin.sg-col.sg-col-12-of-12.s-widget-spacing-small').forEach(element => {
					let product = {}
					// to get the product title from the HTML document with class name selector
					product.title = element.querySelector(".puisg-row").lastChild.querySelector("span.a-size-small.a-color-base.a-text-normal").innerHTML

					// to get the product rating from the HTML document with class name selector
					product.rating = element.querySelector(".puisg-row").querySelector(".a-icon-alt").innerHTML
					
					// to get the number of reviews on the product from the HTML document with class name selector
					product.reviews = element.querySelector(".puisg-row").querySelector(".a-size-mini.a-color-base.puis-light-weight-text").innerHTML
					
					// to get the product image URL from the HTML document with class name selector
					product.imgSrc= element.querySelector(".puisg-row").firstChild.querySelector("img.s-image").src
					data.push(product)
				});
				
				//to allow cross-origin request 
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Access-Control-Allow-Headers', '*');
				
				//send a response with the parsed data
				res.send({data})
			
			} catch (error) {
				//if an error is encountered send an 'Internal Server Error'
				res.sendStatus(500)
			}
		
	} else {
		// if keyword parameter is not present, send a 'Bad Request' error
		res.sendStatus(503)
	}
	

}); 

app.listen(PORT, (error) =>{ 
	if(!error) 
		console.log("App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
); 
