import React, {Component} from 'react';
import xlsxParser from 'xlsx-parse-json';
import ReactEcharts from 'echarts-for-react';

class ChartComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartOption: null
        }
    }

    onFileChange = event => {
        xlsxParser
            .onFileSelection(event.target.files[0])
            .then(excelData => {
                this.getTopStudent(excelData);
            });
    };

    getTopStudent = (excelData) => {
        try {

            let data = {
                "name": "Student",
                "children": []
            }
            let keys = Object.keys(excelData)
            for (const property in keys) {
                let data_8th = [];
                let data_9th = [];
                let data_10th = [];

                excelData[keys[property]].map(item => {
                    if (item.Std === '8') data_8th.push(item);
                    if (item.Std === '9') data_9th.push(item);
                    if (item.Std === '10') data_10th.push(item);
                    return '';
                });
                data_8th = data_8th.sort((a, b) => b.Percentage - a.Percentage).slice(0, 3);
                data_9th = data_9th.sort((a, b) => b.Percentage - a.Percentage).slice(0, 3);
                data_10th = data_10th.sort((a, b) => b.Percentage - a.Percentage).slice(0, 3);

                data.children.push({
                    name: keys[property], "children": [
                        {"name": "8th", "children": this.getTop3(data_8th)},
                        {"name": "9th", "children": this.getTop3(data_9th)},
                        {"name": "10th", "children": this.getTop3(data_10th)},
                    ]
                });
            }
            this.getChartOption(data);
        } catch (e) {
            console.log('============',e)
        }
    }

    getTop3 = (data) => {
        return data.map(item => {
            return {name: item['Student Name'], value: item.Percentage}
        });
    }

    getChartOption = (data) => {
        let chartOption = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: [data],
                    top: '1%',
                    left: '10%',
                    bottom: '1%',
                    right: '10%',
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        }
        this.setState({chartOption});
    }

    render() {
        const {chartOption} = this.state;
        return (
            <div>
                <form>
                    <label htmlFor="file">Select file input </label>
                    <input onChange={this.onFileChange} type="file" id="file"/>
                    <br/>
                    <br/>
                    {chartOption &&
                    <ReactEcharts
                        option={chartOption}
                        style={{
                            height: '80vh', border: '1px solid #DDD',
                            margin: "auto", width: '90%'
                        }}/>
                    }
                </form>
            </div>
        );
    }
}

export default ChartComponent;