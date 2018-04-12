import React from 'react';

import './Roulette.css';


class Roulette extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinAngleStart: 0,
            startAngle: props.startAngle,
            spinTime: 0,
            arc: Math.PI / (props.options.length / 2),
        };
        this.spinTimer = null;
        this.handleOnClick = this.handleOnClick.bind(this);
        this.spin = this.spin.bind(this);
        this.rotate = this.rotate.bind(this);
    }

    static defaultProps = {
        options:  ['item1', 'item2', 'item3', 'item4', 'item5'],
        baseSize: 275,
        spinAngleStart: Math.random() * 10 + 10,
        spinTimeTotal: Math.random() * 3 + 4 * 1000,
    };

    componentDidMount() {
        this.drawRouletteWheel();
        if(this.props.spin){
            this.handleOnClick();
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.options.length!==this.props.options.length) {
            this.drawRouletteWheel();
        }

    }
    componentDidUpdate(prevProps){

        if(prevProps.options.length!==this.props.options.length) {
            this.drawRouletteWheel();
        }
        if(this.props.spin){
            this.handleOnClick();
        }
    }

    byte2Hex(n) {
        const nybHexString = '0123456789ABCDEF';
        return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    }

    RGB2Color(r,g,b) {
        return '#' + this.byte2Hex(r) + this.byte2Hex(g) + this.byte2Hex(b);
    }

    getColor(item, maxitem) {
        const phase = 0;
        const center = 128;
        const width = 128;
        const frequency = Math.PI*2/maxitem;

        const red   = Math.sin(frequency*item+2+phase) * width + center;
        const green = Math.sin(frequency*item+0+phase) * width + center;
        const blue  = Math.sin(frequency*item+4+phase) * width + center;

        return this.RGB2Color(red,green,blue);
    }

    drawRouletteWheel() {
        const { options, baseSize } = this.props;
        let { startAngle, arc } = this.state;
        let totalWeight=0;
        this.props.weights.forEach((w)=>{
           totalWeight+=w;
        });
        arc=Math.PI / (totalWeight/ 2);
        this.setState({arc:arc});

        // const spinTimeout = null;
        // const spinTime = 0;
        // const spinTimeTotal = 0;

        let ctx;

        const canvas = this.refs.canvas;
        if (canvas.getContext) {
            const outsideRadius = baseSize - 25;
            const textRadius = baseSize - 45;
            const insideRadius = 10;

            ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,600,600);

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;

            ctx.font = '100% Helvetica, Arial';
            let actualSum=0;
            for(let i = 0; i < this.props.options.length; i++) {
                const angle = startAngle + (actualSum) * arc;
                actualSum+= this.props.weights[i];

                ctx.fillStyle = this.getColor(i, this.props.options.length);
                ctx.beginPath();
                ctx.arc(baseSize, baseSize, outsideRadius, angle, angle + arc*(this.props.weights[i]), false);
                ctx.arc(baseSize, baseSize, insideRadius, angle + arc*(this.props.weights[i]), angle, true);
                ctx.fill();

                ctx.save();
                ctx.fillStyle = 'white';
                ctx.translate(baseSize + Math.cos(angle + arc / 2) * textRadius,
                    baseSize + Math.sin(angle + arc / 2) * textRadius);
                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                const text = this.props.options[i];
                ctx.fillText(text, -ctx.measureText(text).width / 2, -5);
                ctx.restore();
            }

            //Arrow
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.lineTo(baseSize + 10, baseSize - (outsideRadius + 20));
            ctx.lineTo(baseSize + 0, baseSize - (outsideRadius - 5));
            ctx.lineTo(baseSize - 10, baseSize - (outsideRadius + 20));
            ctx.fill();
            ctx.stroke();
        }
    }

    spin() {
        this.spinTimer = null;
        this.setState({ spinTime: 0}, () => this.rotate());
    }

    rotate(){

        if(this.state.spinTime >this.props.spinTimeTotal) {
            clearTimeout(this.spinTimer);
            this.stopRotateWheel();
        } else {
            const spinAngle = 20;
            //Avanza de spinAngle cada 30 ms
            this.setState({
                startAngle: this.state.startAngle + spinAngle * Math.PI / 180,
                spinTime: this.state.spinTime + 30,
            }, () => {
                this.drawRouletteWheel();
                clearTimeout(this.spinTimer);
                this.spinTimer = setTimeout(() => this.rotate(), 30);
            })
        }
    }

    stopRotateWheel() {
        let { startAngle, arc } = this.state;
        const { options, baseSize } = this.props;

        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        const degrees = startAngle * 180 / Math.PI + 90;
        const arcd = arc * 180 / Math.PI;
        let index = Math.floor((360 - degrees % 360) / arcd);
        ctx.save();
        ctx.font = 'bold 20px Helvetica, Arial';
        let i=0;
        while(index>0){
            index-=this.props.weights[i];
            i+=1;
        }
        const text = this.props.options[index<0?i-1:i];
        //ctx.fillText(text, baseSize - ctx.measureText(text).width / 2, baseSize / 3);
        ctx.restore();
        this.props.onComplete(text,this.state.startAngle);
    }



    handleOnClick() {
       this.props.onSpin(()=> {
           this.spin();
       });
    }

    render() {
        const { baseSize } = this.props;

        return (
            <div className="roulette">
                <div className="roulette-container">
                    <canvas ref="canvas" width={baseSize * 2} height={baseSize * 2} className="roulette-canvas"></canvas>
                </div>
            </div>
        );
    }
}

export default Roulette;
