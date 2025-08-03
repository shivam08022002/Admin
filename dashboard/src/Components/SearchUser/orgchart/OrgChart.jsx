import React from 'react';
import './OrgChart.css';

const OrgChartNode = ({ name, index }) => {
    let abbreviation = "AD";
    let position = "Admin";

    if (name.startsWith("SSC")) {
        abbreviation = "SSC";
        position = "SSC";
    } else if (name.startsWith("SC")) {
        abbreviation = "SC";
        position = "Sub Company";
    } else if (name.startsWith("SST")) {
        abbreviation = "SST";
        position = "Super Stockist";
    } else if (name.startsWith("SS")) {
        abbreviation = "SS";
        position = "Stockist";
    } else if (name.startsWith("SA")) {
        abbreviation = "SA";
        position = "Agent";
    } else if (name.startsWith("SP")) {
        abbreviation = "SP";
        position = "Client";
    }
    return (
        <div className="org-chart-node">
            <div className="node-content">
                <div className="node-icon">{abbreviation}</div> {/* First letter as abbreviation */}
                <div className="node-text">
                    <div className="node-title">{name}</div>
                    <div className="node-description">{position}</div> {/* Description text */}
                </div>
            </div>
        </div>
    );
};

const OrgChart = ({ hierarchy }) => {
    // const hierarchy = [
    //     { name: "SA14(Vicky)", description: "Lead Architect" },
    //     { name: "SS13(Manohar)", description: "Senior Manager" },
    //     { name: "SST11(Chandrashekhar)", description: "Tech Lead" },
    //     { name: "SC10(SM2 SC1)", description: "Team Member" },
    //     { name: "SM2(Agent)", description: "Agent Support" },
    //     { name: "AD12345(first)", description: "Junior Agent" }
    // ];

    return (
        <div className="org-chart">
            {hierarchy.map((node, index) => (
                <OrgChartNode
                    key={index}
                    name={node}
                    index={index}
                // description={node.description} 
                />
            ))}
        </div>
    );
};

export default OrgChart;
