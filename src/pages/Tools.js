import React, { Component } from 'react';
import {Container} from "reactstrap";
import SectionTitle from "../components/SectionTitle";
import {toolService} from "../_services/tool.service";
import NewToolCategoryForm from "../components/NewToolCategoryForm";
import Tool from "../components/Tool";
import NewToolForm from "../components/NewToolForm";

import './../_styles/_components/_tools.scss';

class Tools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: []
        };

        this.addNewCategory = this.addNewCategory.bind(this);
    }

    componentDidMount() {
        toolService.getTools().then((data) => {
            this.setState({categories: data.categories});
        });
    }

    addNewCategory(category) {
        const categories = this.state.categories.slice();
        category.tools = [];
        categories.push(category);
        this.setState({categories});
    }

    addNewTool(tool, categoryIndex) {
        const categories = this.state.categories.slice();
        if(categoryIndex >= categories.length) return;
        categories[categoryIndex].tools.push(tool);
        this.setState({categories});
    }

    buildTable = () => {
        let table = [];
        const { categories } = this.state;
        for(let i = 0; i < categories.length; i++) {
            const category = categories[i];
            let tools = [];
            for(let toolsIndex = 0; toolsIndex < category.tools.length; toolsIndex++) {
                const tool = category.tools[toolsIndex];
                tools.push(
                    <Tool tool={tool} key={category.tools[toolsIndex].id}/>
                );
            }
            tools.push(
                <NewToolForm key={'new-tool-'+i} categoryId={category.id}
                             onCreate={(data) => this.addNewTool(data, i)}/>
            );
            table.push(
                <div key={`${category.id}`} className='tools'>
                    <h3 className='tools__title'>{ category.name }{ category.isSquad &&
                        <span className="badge badge-primary">SQUAD</span>
                    }
                    </h3>
                    <div className='tools__list flex flex--start-center flex--wrap'>
                        { tools }
                    </div>
                </div>
            );
        }
        return table;
    };

    render() {
        return (
            <Container>
                <SectionTitle title='My tools'/>
                { this.buildTable() }
                <NewToolCategoryForm onCreate={this.addNewCategory}/>
            </Container>
        );
    }
}

export default Tools;
