
//https://cdnjs.cloudflare.com/ajax/libs/d3/6.7.0/d3.js
// v3.10
//author: Qinbo Zhou
//update:2021-10-20

function drew_KM(kk) {

    // Data for demo
    var data_new = [{
        "time": 3,
        "status": 1,
        "group": "Male"
    },
    {
        "time": 5,
        "status": 1,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 1,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 1,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 313,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 513,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 213,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 13,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 24,
        "status": 1,
        "group": "Male"
    },
    {
        "time": 55,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 72,
        "status": 0,
        "group": "Male"
    },
    {
        "time": 134,
        "status": 1,
        "group": "Male"
    },
    {
        "time": 15,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 23,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 44,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 15,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 23,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 44,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 15,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 23,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 44,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 375,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 475,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 575,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 675,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 75,
        "status": 0,
        "group": "Female"
    },
    {
        "time": 92,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 163,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 357,
        "status": 1,
        "group": "Female"
    },
    {
        "time": 22,
        "status": 1,
        "group": "other"
    },
    {
        "time": 53,
        "status": 1,
        "group": "other"
    },
    {
        "time": 327,
        "status": 1,
        "group": "other"
    }
    ]


    data = kk || data_new;

    // remove array with null.
    data_not_empty = []
    data.forEach(function (el) {
        //console.log(el)
        if (el["time"] !== null && el["status"] !== null && el["group"] !== null) {
            data_not_empty.push(el)
        }
    })
    data = data_not_empty


    // got patient number and write to html
    patient_number = data_not_empty.length

    //document.getElementsByClassName("patients-number")[0].innerHTML = patient_number;



    compare = (a, b) => {
        if (a.time == b.time) {
            return b.status - a.status
        }
        return a.time - b.time
    }

    data = data.sort(compare);
    console.log(data)


    let data_counted = data.reduce((acc, obj) => {
        var exist = acc.find(aa => JSON.stringify(obj) === JSON.stringify(aa.name));
        if (exist) {
            exist.count++;
        } else {
            acc.push({
                name: obj,
                count: 1
            });
        }
        return acc;
    }, []);
    console.log(data_counted);

    data_counted = data_counted.map(x => Object.assign(x.name, { "count": x.count }));
    //console.log(data_counted);

    // seperate by group 

    // unique group name: 
    let unique_group = [...new Set(data_counted.map(item => item.group))];

    //groupby date by group
    data_by_group = [];
    data_counted.forEach((element) => {
        if (!data_by_group[element.group]) {
            data_by_group[element.group] = [];
        }
        data_by_group[element.group].push(element);
    })

    //remove key
    data_by_group = Object.values(data_by_group);
    //console.log(data_by_group);


    //calculate probibility
    data_by_group.forEach(group => {
        //add total number as number
        group = group.reverse();
        size = 0;
        group.forEach(element => {
            size = size + element.count;
            element.size = size;
        })

        //calculate probibility
        group = group.reverse();
        group.unshift({ ...group[0] });
        group[0]["time"] = 0;
        group[0]["status"] = 0;
        group[0]["count"] = 0;
        //console.log(group);

        for (let i in group) {
            group[i]['probability'] = (i == 0) ? (1 - group[i]['status'] * group[i]['count'] / group[i]['size']) : group[i - 1][['probability']] * (1 - group[i]['status'] * group[i]['count'] / group[i]['size'])
            //console.log(group[i])
        }

    })

    data = data_by_group
    console.log(data)



    //D3
    /* Begin d3.js */
    /* Globals */
    var w = 550, h = 300, h2 = data.length * 20, m = 40, lg = 150, max = min = 0;
    //Scalar function   
    //console.log(d3.max(data_new, function(d) { return +d.time;}))
    max = d3.max(data_counted, function (d) { return +d.time; })
    var x = d3.scaleLinear().domain([-max / 20, max + max / 50]).range([0, w - m * 2 - lg]);
    var y = d3.scaleLinear().domain([1.05, -0.05]).range([0, h - m]);
    //Define axses
    var xAxis = d3.axisBottom(x)
        .tickSize(2)
        .tickPadding(6)
        .ticks(5);
    var yAxis = d3.axisLeft(y)
        .tickSize(2)
        .tickPadding(6);
    //This is the accessor function
    var lineFunction = d3.line()
        .x(function (d) {
            //console.log(x(d.time))
            return x(d.time) + 2 * m;
        })
        .y(function (d) {
            return y(d.probability);
        })
        .curve(d3.curveStepAfter);
    //Draw the svg container
    d3.select(".km_svg").remove();
    var kaplan = d3.select("#survival").append("svg")
        .attr("width", w + (2 * m))
        .attr("height", h + (2 * m) + 100 + h2)
        .attr("class", "km_svg");

    var color = d3.scaleOrdinal(d3.schemeCategory10);


    for (i = 0; i < data.length; i++) {
        kaplan.append("path")
            .attr("d", lineFunction(data[i]))
            .attr("transform", "translate(" + 0 + "," + m + ")")
            .attr("stroke", color(i))
            .attr("stroke-width", 2)
            .attr("fill", "none")

        //Draw Dot
        kaplan.selectAll(".dot" + i)
            .data(data[i])
            .enter()
            .append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) { return x(d.time) + 2 * m; })
            .attr("cy", function (d) { return y(d.probability) })
            .attr("r", 1.5)
            .attr("stroke", color(i))
            .attr("stroke-width", 2)

            .attr("fill", "none")
            .attr("transform", "translate(" + 0 + "," + m + ")");



        kaplan.append("line")//making a line for legend
            .attr("x1", w - lg + 20)
            .attr("x2", w - lg + 40)
            .attr("y1", 70 + i * 15)
            .attr("y2", 70 + i * 15)
            .style("stroke-width", "2")//dashed array for line
            .style("stroke", color(i));

        kaplan.append("text")
            .attr("x", w - lg + 50)
            .attr("y", 75 + i * 15)
            .text(data[i][0].group)
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
    }

    //Draw the x-axis
    var theXAxis = kaplan.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + 2 * m + "," + h + ")")
        .call(xAxis)
        .append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + w / 3 + "," + m + ")")
        .text("Time (in months)");
    //Draw the y-axis
    var theYAxis = kaplan.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + 2 * m + ", " + m + ")")
        .call(yAxis)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + -m + "," + h / 2 + ")rotate(-90)")
        .text("Survival Rate");

        
    //label x-axis
    var theXAxis2 = kaplan.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + 2 * m + "," + h + ")")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + w / 3 + "," + m + ")")
        .text("Time (in months)");
    //label y-axis
    var theYAxis2 = kaplan.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + 2 * m + ", " + m + ")")

        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + -m + "," + h / 2 + ")rotate(-90)")
        .text("Survival Rate");



    //create risk table
    a = xAxis.scale().ticks(5);
    //console.log(a)

var rt = new Array();
    group_name= new Array();

for (i = 0; i < data.length; i++) {
    console.log(i)
    group_name.push(data_by_group[i][0]["group"]) 
    for (j = 0; j < a.length; j++) {
        //var Big_than = data[i].filter(x => x.time > a[j]).length
        var Big_than_list = data[i].filter(x => x.time >= a[j])
        var count_list=new Array();
        //console.log(Big_than_list)
        Big_than_list.forEach(element=>{count_list.push(+element.count)})
        //console.log(count_list)
        if(count_list.length>1){
            Big_than = count_list.reduce((a,b)=>a+b)
        }else {
            Big_than = count_list[0]
        }
    if(Big_than==undefined){
        Big_than=0
    }

        rt.push([a[j],data_by_group[i][0]["group"],Big_than])
    }
}





console.log(rt)

    
      kaplan2=kaplan.append("g")
      .attr("transform", "translate(" + 0 + "," + (h + m+60) + ")")


      var theXAxis_rt = kaplan2.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(" + (3*m +25) + "," + -55 + ")")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + 0 + "," + m + ")")
      .text("Number at risk:");



    //Draw the x-axis
    var theXAxis_rt = kaplan2.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + 2 * m + "," + (data.length*25) + ")")
        .call(xAxis)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + w / 3 + "," + m + ")")
        .text("Time (in months)");

        var theXAxis_rt = kaplan2.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(" + 2 * m + "," + (data.length*25) + ")")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + w / 3 + "," + m + ")")
        .text("Time (in months)");


        var y2 = d3.scaleBand().padding(0.1).domain(group_name).range([0, data.length*25]);
        //Define axses
        var yAxis2 = d3.axisLeft(y2)
            .tickSize(2)
            .tickPadding(6)
            .ticks(5);

    var theYAxis_rt = kaplan2.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + 2 * m + ", " + ( 0 )+ ")")
        .call(yAxis2)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + -m + "," + h / 2 + ")rotate(-90)")
        .text("Survival Rate");

/*
        kaplan2.append("g").selectAll('circle')
        .data(rt)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
            //console.log(d[0]);
            return x(d[0] + 5 * m);
        })
        .attr('cy', (d) => y2(d[1]))
        .attr('r', 5)
        .attr('fill', 'red');
*/
        kaplan2.append("g").selectAll('text')
        .data(rt)
        .enter()
        .append('text')
        .text((d) => {
            console.log(d);
            return d[2];
        })
        .attr('x', (d) => {
            return (x(d[0])  + 75);
        })
        .attr('y', (d) => (y2(d[1])+15 ))
        .style("font-size", "15px")
;















}



