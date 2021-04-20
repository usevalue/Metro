
$(()=>{

    $('.districtbutton').bind('click', (event)=>{
        let clicked=event.target;
        var id;
        if(clicked.localName!='button') {
            id = clicked.parentElement.name;
        }
        else id=clicked.name;
        examineDistrict(id);
    });

    async function examineDistrict(id) {
        $.ajax({
            url: 'examinedistrict/'+id,
            type: 'GET',
            success: (response)=>{
                $('#districtviewer').html(response);
            }
        })
        console.log(id);
    }

//    for(dist=0; dist<buttons.length; dist++) {
//         let district=buttons[dist];
//         console.log(district);

//         //district.on('click', console.log(dist))
//    }

})