
// Function for populating bar graph
function DrawBargraph(sampleId) {
    console.log(`Calling DrawBargraph(${sampleId})`);

    // Reading in data
    d3.json("data/samples.json").then((data) => {
        var BarSamples = data.samples;

        // Filtering to Sample ID and selecting first record
        var BarResultArray = BarSamples.filter(s => s.id == sampleId);
        var BarResult = BarResultArray[0];

        // Identifing variables within data set
        var ba_otu_ids = BarResult.otu_ids;
        var ba_otu_labels = BarResult.otu_labels;
        var ba_sample_values = BarResult.sample_values;

        // Creating graph elements (x, y, and labels) and filter to only top 10 results
        bar_xticks = ba_sample_values.slice(0, 10).reverse();
        bar_yticks = ba_otu_ids.slice(0, 10).map(otuId => `OTU ${otuId} `).reverse();
        barlabels = ba_otu_labels.slice(0, 10).reverse();

        // Creating bar chart
        var trace1 = {
            x: bar_xticks,
            y: bar_yticks,
            type: "bar",
            text: barlabels,
            orientation: "h",
            marker: {
                color: '#08306b'
            }
        };

        barArray = [trace1];

        // Defining bar layout
        var barLayout = {
            title: "Top 10 Microbial Species (OTUs)",
            xaxis: {title: "Value"},
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barArray, barLayout);
    });
}

// Function for drawing bubble graph
function DrawBubblechart(sampleId) {
    console.log(`Calling DrawBubblechart(${sampleId})`);

    // Read in Data
    d3.json("data/samples.json").then((data) => {
        var BubbleSamples = data.samples;

        // Filtering to Sample ID and selecting first record
        var BubbleResultArray = BubbleSamples.filter(s => s.id == sampleId);
        var BubbleResult = BubbleResultArray[0];

        // Identifing variables within data set
        var bu_otu_ids = BubbleResult.otu_ids;
        var bu_sample_values = BubbleResult.sample_values;
        var bu_otu_labels = BubbleResult.otu_labels;

        // Creating bubble chart
        var bubbleTrace = {
            x: bu_otu_ids,
            y: bu_sample_values,
            mode: 'markers',
            text: bu_otu_labels,
            marker: {
                color: bu_otu_ids,
                size: bu_sample_values,
                opacity: 0.8,
                colorscale: "Jet"
            }
        };

        bubbleArray = [bubbleTrace];

        // Bubble chart layout
        var bubbleLayout = {
            title: "Microbial Species (OTUs)",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
    });
}

// Function for drawing gauge
function DrawGauge(sampleId) {
    console.log(`Calling DrawGauge(${sampleId})`);

    // Reading in data
    d3.json("data/samples.json").then((data) => {
        // Variables
        var GaugeData = data.metadata;
        var GaugeResultArray = GaugeData.filter(md => md.id == sampleId);
        var GaugeResult = GaugeResultArray[0];

        // Identifying variables within data set for gauge
        var ga_washFreq = parseFloat(GaugeResult.wfreq);
        
        // Gauge
        var gaugeData = [
            {
                domain: {x: [0, 1], y: [0, 1]},
                value: ga_washFreq,
                type: "indicator",
                mode: "gauge+number",
                title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
                gauge: {
                    axis: {range: [null, 9], tickWidth: 1, tickcolor: '#0000000'},
                    bar: {color: '#08306b'},
                    steps: [
                        {range: [0, 1], color: '#fff5eb'},
                        {range: [1, 2], color: '#fee6ce'},
                        {range: [2, 3], color: '#fdd0a2'},
                        {range: [3, 4], color: '#fdae6b'},
                        {range: [4, 5], color: '#fd8d3c'},
                        {range: [5, 6], color: '#f16913'},
                        {range: [6, 7], color: '#d94801'},
                        {range: [7, 8], color: '#a63603'},
                        {range: [8, 9], color: '#7f2704'}
                    ]
                }
            }
        ];

        var gaugeLayout = {
            width: 500,
            height: 400,
            margin: {t: 30, l: 50}
        };

        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}

// Function for populating metadata table
function ShowMetadata(sampleId) {
    console.log(`Calling ShowMetadata(${sampleId})`);

    // Reading in data
    d3.json("data/samples.json").then((data) => {
        // Variables
        var metadata = data.metadata;
        var MdResultArray = metadata.filter(md => md.id == sampleId);
        var MdResult = MdResultArray[0];

        // Selecting html element
        var Panel = d3.select("#sample-metadata");

        // Clear panel before redrawing
        Panel.html("");

        // Populating panel
        Object.entries(MdResult).forEach(([key, value]) => {
            var textToShow = `${key}: ${value}`;
            Panel.append("h6").text(textToShow);
        });
    });
}

// Function for user input and redrawing dashboard elements
function optionChanged(newSampleId) {
    console.log(`User selected: ${newSampleId}`);

    DrawBargraph(newSampleId);
    DrawBubblechart(newSampleId);
    DrawGauge(newSampleId);
    ShowMetadata(newSampleId);
    
}

// Initialize Dashboard
function initDashboard() {
    console.log("Initializing Dashboard");

    // Creating selector
    var selector = d3.select("#selDataset");

    // Loading Data
    d3.json("data/samples.json").then((data) => {
        console.log(data);

        // Populating Drop-down menu
        var sampleNames = data.names; 
        sampleNames.forEach((sampleId) => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId);
        });

        // Default item
        var sampleId = sampleNames[0];

        // Drawing dashboard elements
        DrawBargraph(sampleId);
        DrawBubblechart(sampleId);
        DrawGauge(sampleId);
        ShowMetadata(sampleId);

    });
}

initDashboard();
