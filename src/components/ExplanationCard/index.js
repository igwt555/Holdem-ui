import './style.scss';

const ExplanationCard = (props) => {
    return (
        <div className='explanation_card'>
            <img src={props.attr.img} alt='' />
            <p className='title'>{props.attr.title}</p>
            <div className='desc'>
                {
                    props.attr.desc.map((para, i) => <p key={i} dangerouslySetInnerHTML={{
                        __html: para
                    }}></p>)
                }
            </div>
        </div>
    );
};

export default ExplanationCard;