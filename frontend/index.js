function search() {

    document.getElementById("text").innerHTML="Please wait...";
    document.getElementById("results").innerHTML="";
    document.getElementById("total").innerHTML="Results:";

    //get the content of the input field
    let query = document.getElementById('search').value;

    //check if the input field is empty
    if (!query || query=="") {
        alert("Search field is empty!");
        document.getElementById("text").innerHTML="Search for a product to get started";
    } else {
        var xhttp = new XMLHttpRequest();
        //send a get request to the backend express app running on port 3001
        xhttp.open("GET", `http://127.0.0.1:3001/api/scrape/?keyword=${query}`, true);
        xhttp.send();

        xhttp.onreadystatechange = function() {
            //check if the request completes and sends a response
            if (this.readyState == 4 && this.status == 200) {

                //parse the response text as a JSON element
                let resp = JSON.parse(this.responseText)
                
                //display the total number of results in the div with total ID
                document.getElementById("total").innerHTML=`Showing ${resp.data.length} results for <span style='font-style: italic; color: red;'>${query}</span>`

                //check if the number of data array is empty
                if (resp.data.length==0) {
                    document.getElementById("text").innerHTML="No result was found for this product";
                } else {
                    
                    let result = resp.data.map(product=>{
    
                        //format each product
                        return (`<div class='prodcont'> <p class='title'>Product Title</p> <p class='details space'> ${product.title} </p> <p class='title'>Ratings(stars out of five)</p> <p class='details space'>${product.rating}</p> <p class='title'>Number of reviews</p> <p class='details space'>${product.reviews}</p> <p class='title'>Product image URL</p> <a href=${product.imgSrc}>${product.imgSrc}</a> </div>`)
                    });
    
                    //display the result well formated in the div with results ID
                    document.getElementById("text").innerHTML="";
                    document.getElementById("results").innerHTML=result.join(" ");
        
                }
           }
        };
    }
}
