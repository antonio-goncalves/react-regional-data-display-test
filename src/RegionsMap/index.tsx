
import {RegionMapState, RegionsMapProps} from "~/RegionsMap/index.types";

import React from 'react';
import mapboxgl from 'mapbox-gl';
import {Scale} from "./Scale";
import {DataScale, Region, RegionData} from "../ReactRegionalDataDisplay/index.types";
import lodash from 'lodash'
import {Feature, FeatureCollection, GeoJSON, GeoJsonProperties, Geometry} from "geojson";

import {ScaleInterval} from "~/RegionsMap/Scale.types";




export  class RegionsMap extends React.Component<RegionsMapProps,RegionMapState>{



    private ref: React.RefObject<string | HTMLElement >;
    private map : mapboxgl.Map | null;
    private idInc: number;
    private idHashMap: {[key: string]: number};
    private geoJSONIdHashMap: {[key: number]: string};
    private popup!: mapboxgl.Popup;

    static defaultProps = {
        mapHeight:500,
        center:{zoom:1,lng:0,lat:0}
    }

    constructor(props: RegionsMapProps | Readonly<RegionsMapProps>) {
        super(props);
        this.map = null;
        this.getFeatureFromRegion = this.getFeatureFromRegion.bind(this);
        this.onScaleIntervalOver = this.onScaleIntervalOver.bind(this);

        this.state = {
            lng: props.center.lng ,
            lat: props.center.lat,
            zoom: props.center.zoom,
            hoveredRegionIds: [],
            showTooltip:false
        };

        this.ref = React.createRef();
        this.idInc = 0;
        this.idHashMap = {}
        this.geoJSONIdHashMap = {}
    }

    checkProps(){
        const {mapBoxToken,regionsData,regions,scale,unit} = this.props;
        return !!mapBoxToken && !! regionsData && !!regions && !!scale && !!unit


    }

    componentWillUnmount() {
        this.map?.remove()
        this.map = null;
    }

    componentDidMount() {
        if(!this.checkProps()) return;
        if(this.ref.current === null) return;

        const { lng, lat, zoom } = this.state;
        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className:"regional-data-display-map-popup",
            maxWidth:"none"
        });

        this.map = new mapboxgl.Map({
            style: 'mapbox://styles/mapbox/streets-v11',
            ...this.props.mapBoxOptions,
            container: this.ref.current,
            center: [lng, lat],
            zoom: zoom,
            accessToken:this.props.mapBoxToken
        });
        this.map.on('move', () => {
            if(this.map === null) return
            this.setState({
                lng: Number(this.map.getCenter().lng.toFixed(4)),
                lat: Number(this.map.getCenter().lat.toFixed(4)),
                zoom: Number(this.map.getZoom().toFixed(2))
            });
        });



        this.map.on('load', () => {
            this.addMapSource()
            this.addMapLayer()

        });
        this.map.on('mousemove', 'regions-fills', (e) => {
            if(this.map === null) return
            this.map.getCanvas().style.cursor = 'pointer';

            if (e.features && e.features.length > 0) {


                const hoveredRegionId = this.geoJSONIdHashMap[Number( e.features[0].id)];
                this.popup.setLngLat(e.lngLat)
                if(this.state.hoveredRegionIds.length>1 || this.state.hoveredRegionIds[0] !==hoveredRegionId){
                    if(typeof e.features[0].id === "number"){
                        this.setState({
                            hoveredRegionIds: [hoveredRegionId],
                            showTooltip:true
                        })
                    }

                }

            }
        });

        this.map.on('mouseleave', 'regions-fills', (ev) => {
            if(this.map === null) return
            this.map.getCanvas().style.cursor = '';
            this.setState({hoveredRegionIds:[],showTooltip:false})
        });

    }



    setMapHover( hover: boolean){
        for(const hoveredRegionId of this.state.hoveredRegionIds){
            const id = this.idHashMap[ hoveredRegionId]
            if(id!==undefined){
                if(this.map === null) return
                this.map.setFeatureState(
                    { source: 'regions',id: this.idHashMap[ hoveredRegionId] },
                    { hover: hover }
                );
            }

        }



    }



    componentDidUpdate(prevProps: Readonly<RegionsMapProps>, prevState: Readonly<RegionMapState>, snapshot?: any) {
        if(!this.checkProps()) return;
        if(prevProps.center !== this.props.center){

            this.setState(this.props.center,()=>{
                if(this.map === null) return
                this.map.setCenter([this.state.lng,this.state.lat])
                this.map.setZoom(this.state.zoom)
            })
        }
        if(prevProps.regionsData!==this.props.regionsData){
            this.updateSource()
            this.setMapPopup()
        }

        if(prevState.hoveredRegionIds !== this.state.hoveredRegionIds){
            this.setMapHover(true);
            this.setMapPopup();

        }
        if(prevState.showTooltip !== this.state.showTooltip){
            this.setMapPopup();
        }
    }

    setMapPopup(){


        if(this.state.showTooltip){
            const regionId:string = this.state.hoveredRegionIds[0]
            const region = this.props.regions.find(el=>el.id === regionId)
            const regionData = this.props.regionsData?.find(el=>el.id === regionId)

            if(region && regionData){
                const value = regionData.value===null?"No Data":`${regionData.value} ${this.props.unit.symbol}`;
                const footnoteIds:string[] =  regionData.footnoteIds || []
                let html =
                    `<h3>${region.name}</h3>
                     <p>${value}</p>`
                for(const footnoteId of footnoteIds){
                    const footnote =this.props.footnotes?.find(el=>el.id === footnoteId)
                    if(footnote){
                        html = html + `<p><small>${footnote.value}</small></p>`
                    }
                }
                if(this.map === null) return
                this.popup.setHTML(html).addTo(this.map)
            }

        }else{
           this.popup.remove();
        }
    }

    shouldComponentUpdate(nextProps: Readonly<RegionsMapProps>, nextState: Readonly<RegionMapState>, nextContext: any): boolean {
        if(!this.checkProps()) return false;
        if(this.state.hoveredRegionIds !== nextState.hoveredRegionIds){
            this.setMapHover(false);
        }
        return true;
    }


    clearMapLayers(){
        this.props.regions.forEach(region=>{
            if(this.map === null) return
            if(this.map.getLayer(region.id + "outline")){
                this.map.removeLayer( region.id + "outline")
            }

        })
        this.props.regions.forEach(region=>{
            if(this.map === null) return
            if(this.map.getLayer(region.id)){
                this.map.removeLayer( region.id)
            }

        })
    }

    getFeatureFromRegion(region: Region):Feature {
        const geoJSON: GeoJSON = region.geoJSON;

        this.idInc = this.idInc + 1;
        this.idHashMap[region.id] = this.idInc;
        this.geoJSONIdHashMap[this.idInc] = region.id;
        const regionData:RegionData | undefined = this.props.regionsData?.find(el=>el.id === region.id)

        return {
            type:geoJSON.type,
            id:this.idInc,
            bbox:geoJSON.bbox,
            geometry:geoJSON.geometry,
            properties:{
                ...geoJSON.properties,
                __region__value:regionData?.value,
                __region__footnote__ids:regionData?.footnoteIds?.join(", ")
            }
        }


    }

    getSourceData():  FeatureCollection<Geometry, GeoJsonProperties> {
        this.idInc=0;
        this.idHashMap = {};
        this.geoJSONIdHashMap = {}
        return {
            type:"FeatureCollection",
            features:this.props.regions.map(region=>(this.getFeatureFromRegion(region)))
        }
    }

    addMapSource(){
        if(this.map === null) return
        this.map.addSource("regions",{
            type:"geojson",
            data:this.getSourceData()
        })



    }

    updateSource(){
        const updateStyle =()=> {
            if (this.map === null) return
          //  this.map.setPaintProperty("regions-fills", 'fill-color', this.getLayerFillColor());
            this.map.off("sourcedata", updateStyle)
        }
        if(this.map === null) return
        const source: any = this.map.getSource("regions")
        if (typeof source?.setData === "function") {
            source.setData(this.getSourceData())

            this.map.on("sourcedata",updateStyle)
        }
        try{

            this.map.setPaintProperty("regions-fills",'fill-color',this.getLayerFillColor());
        }catch (e){

            if( e instanceof Error && e.message === "Style is not done loading"){
                console.warn("Updated performed during map initialization")
            }else{
                throw e
            }

        }



    }

    getLayerFillColor(){
        const array:Array<string | number> = []

        for(let i=0;i<this.props.scale.steps.length-1;i++){
            const step = this.props.scale.steps[i]
            array.push(this.props.scale.colors[i])
            array.push(this.props.scale.steps[i])
        }
        array.push(this.props.scale.colors[this.props.scale.steps.length - 1])
        let arr = [
            'step', // arg 1
            ['get', '__region__value'], // arg 2
            ...array
        ]
        return arr
    }

    addMapLayer(){
        if(this.map === null) return
        const color:Array<string | number | string[]> = this.getLayerFillColor();
        this.map.addLayer({
            'id': 'regions-border',
            'type': 'line',
            'source': 'regions',
            'layout': {},
            'paint': {
                'line-color': '#000000',
                'line-width': 1
            }
        });
        this.map.addLayer({
            'id': 'regions-fills',
            'type': 'fill',
            'source': 'regions',
            'layout': {

            },

            'paint': {

              //  'fill-color': '#627BC1',
                //@ts-ignore
                'fill-color':color,
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.7,
                    0.3
                ]
            }
        });






    }

    onScaleIntervalOver(scaleInterval?: ScaleInterval): void{
        let hoveredRegionIds:Array<string> = []
        if(scaleInterval && this.props.regionsData){
            hoveredRegionIds = this.props.regionsData.filter(el=>el.value!==null && el.value>= scaleInterval.minValue && el.value <scaleInterval.maxValue).map(el=>el.id)
        }
        this.setState({hoveredRegionIds})
    }


    render() {
        if(!this.checkProps()) return null;
        return (
            <div>
                <div className={this.props.mapContainerClassName} style={{height: this.props.mapHeight,...this.props.mapContainerStyle}} ref={this.ref as React.RefObject<HTMLDivElement>}/>
                <Scale onMouseOver={this.onScaleIntervalOver} value={this.props.scale}  unit={this.props.unit}  />
            </div>
        );
    }


}