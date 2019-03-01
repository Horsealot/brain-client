import React, { Component } from 'react';
import {Container} from "reactstrap";
import {fftService} from "../_services/fft.service";

import FullPageLoader from "../components/FullPageLoader";

import './../_styles/_components/_fft.scss';
import SectionTitle from "../components/SectionTitle";
import {isAdmin} from "../_helpers/admin-validator";
import connect from "react-redux/es/connect/connect";

class FoodForThought extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fftArticles: [],
            loaded: false,
            isSuperAdmin: isAdmin(this.props.authentication.user),
        };
        this.deleteArticle = this.deleteArticle.bind(this);
    }

    componentDidMount() {
        fftService.getArticles().then((data) => {
            this.setState({fftArticles: data.messages, loaded: true});
        });
    }

    deleteArticle(e, article) {
        console.log(article);
        e.stopPropagation();
        e.preventDefault();
        fftService.deleteArticle(article.id).then(() => {
            let fftArticles = [...this.state.fftArticles];
            let index=-1;
            fftArticles.forEach((fftArticle, i) => {
                if(fftArticle.id === article.id) {
                    index = i;
                }
            });
            if(index>=0) {
                fftArticles.splice(index, 1);
            }
            this.setState({fftArticles});
        });
    }

    render() {
        const { loaded, fftArticles, isSuperAdmin } = this.state;
        if(!loaded) {
            return (<FullPageLoader />);
        }
        return (
            <Container>
                <SectionTitle title='Food for thought'/>
                <div className='fft flex flex--start-center flex--wrap'>
                    {
                        fftArticles.map((article) =>
                            <a key={article.id} href={article.media.source.link}>
                                <div className='fft__article'>
                                    { isSuperAdmin &&
                                        <i onClick={(e) => this.deleteArticle(e, article)} className="fas fa-times-circle fft__article__delete"/>
                                    }
                                    <div className='fft__article__image' style={{backgroundImage: "url('" + article.media.image + "')"}}/>
                                    <div className='fft__article__label'>
                                        <div className='fft__article__label__headline'>{article.media.headline}</div>
                                        <div className='fft__article__label__title'>{article.media.title}</div>
                                        <div className='fft__article__label__source'>{article.media.source.name}</div>
                                        <div className='fft__article__label__date'>{article.createdAt}</div>
                                    </div>
                                </div>
                            </a>
                        )
                    }
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedFoodForThought = connect(mapStateToProps, null)(FoodForThought);
export default connectedFoodForThought;

