import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import Favicon from 'react-favicon';
import resObjPath from '../libs/resObjPath';
import logout from '../helpers/logout';
import { setTitle } from '../libs/documentTitleBuilder';

import '../style/all.css';
import '../style/all.min.css';
import '../style/bootstrap.min.css';
import '../style/style.css';
import '../style/style.bundle.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    setTitle({ siteName: 'PAYPER WIN', delimiter: '|', pageTitle: 'Admin' });
  }


  render() {
    const { user, getUser, history, updateUser, location } = this.props;
    return (
      <div id="kt_body" className="header-fixed subheader-enabled">
        <Favicon url={'/images/favicon.ico'} />

    <div className="d-flex flex-column flex-root">

      <div className="d-flex flex-row flex-column-fluid page">

        <div className="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">

          <div id="kt_header_mobile" className="header-mobile">

            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html">
              <img alt="Logo" src="/images/logo-default.png" className="max-h-30px" />
            </a>

            
            <div className="d-flex align-items-center">
                      <button className="btn p-0 burger-icon burger-icon-left ml-4" id="kt_header_mobile_toggle">
                        <span></span>
                      </button>
                      <button className="btn p-0 ml-2" id="kt_header_mobile_topbar_toggle">
                        <span className="svg-icon svg-icon-xl">

                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <polygon points="0 0 24 0 24 24 0 24"></polygon>
                            <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                            <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero"></path>
                          </g>
                  </svg>

                </span>
              </button>
            </div>

          </div>

          
          <div id="kt_header" className="header header-fixed">

            <div className="container">

              <div className="d-none d-lg-flex align-items-center mr-3">

                <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html" className="mr-20">
                        <img alt="Logo" src="/images/logo-default.png" className="logo-default max-h-35px" />
                </a>

              </div>

              
              <div className="topbar topbar-minimize">

                
                
                <div className="dropdown">

                  <div className="topbar-item" data-toggle="dropdown" data-offset="0px,0px">
                            <div className="btn btn-icon btn-clean h-40px w-40px btn-dropdown">
                              <span className="svg-icon svg-icon-lg">

                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                  <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                  <path d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>
                                  <path d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z" fill="#000000" fill-rule="nonzero"></path>
                                </g>
                        </svg>

                      </span>
                          </div>
                        </div>

                  
                  <div className="dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim-up dropdown-menu-lg p-0">

                    <div className="d-flex align-items-center p-8 rounded-top">

                      <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                              <img src="./images/300_21.jpg" alt="" />
                      </div>

                      
                      <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">Administrator</div>

                    </div>
                            <div className="separator separator-solid"></div>

                    
                    <div className="navi navi-spacer-x-0 pt-5">

                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/custom/apps/user/profile-1/personal-information.html" className="navi-item px-8">
                                <div className="navi-link">
                                  <div className="navi-icon mr-2">
                                    <i className="flaticon2-calendar-3 text-success"></i>
                                  </div>
                                  <div className="navi-text">
                                    <div className="font-weight-bold">Change Password</div>
                                  </div>
                                </div>
                              </a>

                      
                      <div className="navi-separator mt-3"></div>
                              <div className="navi-footer px-8 py-5">
                                <a href="https://urbanmerchantdesign.com/ppw/admin/dist/custom/user/login-v2.html" target="_blank" className="btn btn-light-primary font-weight-bold">Sign Out</a>
                              </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          
          <div className="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">
                    <div className="container">

              <div id="kt_header_menu" className="header-menu header-menu-left header-menu-mobile header-menu-layout-default header-menu-root-arrow">

                <ul className="menu-nav">
                          <li className="menu-item menu-item-open menu-item-here menu-item-submenu menu-item-rel menu-item-open menu-item-here" data-menu-toggle="click" aria-haspopup="true">
                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html" className="menu-link">
                              <span className="menu-text">Dashboard</span>
                            </a>
                          </li>
                          <li className="menu-item" data-menu-toggle="click" aria-haspopup="true">
                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/customers.html" className="menu-link">
                              <span className="menu-text">Customers</span>
                              <span className="menu-desc"></span>
                            </a>
                          </li>
                          <li className="menu-item" data-menu-toggle="click" aria-haspopup="true">
                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/transactions.html" className="menu-link">
                              <span className="menu-text">Transactions</span>
                              <span className="menu-desc"></span>
                            </a>
                          </li>
                          <li className="menu-item" data-menu-toggle="click" aria-haspopup="true">
                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html" className="menu-link">
                              <span className="menu-text">Events</span>
                              <span className="menu-desc"></span>
                            </a>
                          </li>
                          <li className="menu-item" data-menu-toggle="click" aria-haspopup="true">
                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#reports" className="menu-link">
                              <span className="menu-text">Reports</span>
                              <span className="menu-desc"></span>
                            </a>
                          </li>
                          <li className="menu-item" data-menu-toggle="click" aria-haspopup="true">
                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/settings.html" className="menu-link">
                              <span className="menu-text">Settings</span>
                              <span className="menu-desc"></span>
                            </a>
                          </li>
                        </ul>

              </div>

            </div>
                  </div>

          
          <div className="d-flex flex-row flex-column-fluid container">

            <div className="main d-flex flex-column flex-row-fluid">

              <div className="subheader py-2 py-lg-4" id="kt_subheader">
                        <div className="w-100 d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">

                  <div className="d-flex align-items-center flex-wrap mr-1">

                    <div className="d-flex align-items-baseline mr-5">

                      <h5 className="text-dark font-weight-bold my-2 mr-5">Dashboard</h5>

                      
                    </div>

                  </div>

                  
                  <div className="d-flex align-items-center">

                    <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="btn btn-light-primary btn-sm font-weight-bold mr-2" id="kt_dashboard_daterangepicker" data-toggle="tooltip" title="" data-placement="left" data-original-title="Select dashboard daterange">
                              <span className="opacity-60 font-weight-bold mr-2" id="kt_dashboard_daterangepicker_title">Today:</span>
                              <span className="font-weight-bold" id="kt_dashboard_daterangepicker_date">May 21</span>
                            </a>

                  </div>

                </div>
                      </div>

              <div className="content flex-column-fluid" id="kt_content">

                
                <div className="row">
                          <div className="col-xl-4">

                    <div className="card card-custom bg-radial-gradient-danger gutter-b card-stretch">

                      <div className="card-header border-0 py-5">
                                <h3 className="card-title font-weight-bolder text-white">Revenue</h3>
                              </div>

                      
                      <div className="card-body d-flex flex-column p-0" style={{ position: 'relative' }}>

                        <div id="kt_mixed_widget_6_chart" style={{ height: '200px', minHeight: '200px'}}>
                          <div id="apexchartsh2d0i4kc" className="apexcharts-canvas apexchartsh2d0i4kc apexcharts-theme-light" style={{ width: '387px', height: '200px'}}>
                            <svg id="SvgjsSvg1082" width="387" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSvgjs="http://svgjs.com/svgjs" className="apexcharts-svg" xmlnsData="ApexChartsNS" transform="translate(0, 0)" style={{ background: 'transparent' }}><g id="SvgjsG1084" className="apexcharts-inner apexcharts-graphical" transform="translate(20, 0)">
                              <defs id="SvgjsDefs1083">
                                <lineargradient id="SvgjsLinearGradient1087" x1="0" y1="0" x2="0" y2="1">
                                  <stop id="SvgjsStop1088" stop-opacity="0.4" stop-color="rgba(216,227,240,0.4)" offset="0"></stop>
                                  <stop id="SvgjsStop1089" stop-opacity="0.5" stop-color="rgba(190,209,230,0.5)" offset="1"></stop>
                                  <stop id="SvgjsStop1090" stop-opacity="0.5" stop-color="rgba(190,209,230,0.5)" offset="1"></stop>
                                </lineargradient>
                                <clippath id="gridRectMaskh2d0i4kc">
                                  <rect id="SvgjsRect1092" width="352" height="201" x="-2.5" y="-0.5" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
                                </clippath>
                                <clippath id="gridRectMarkerMaskh2d0i4kc">
                                  <rect id="SvgjsRect1093" width="351" height="204" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff"></rect>
                                </clippath>
                              </defs>
                              <rect id="SvgjsRect1091" width="7.435714285714286" height="200" x="72.9285640171596" y="0" rx="0" ry="0" opacity="1" stroke-width="0" stroke-dasharray="3" fill="url(#SvgjsLinearGradient1087)" className="apexcharts-xcrosshairs" y2="200" filter="none" fill-opacity="0.9" x1="72.9285640171596" x2="72.9285640171596"></rect>
                              <g id="SvgjsG1114" className="apexcharts-xaxis" transform="translate(0, 0)">
                                <g id="SvgjsG1115" className="apexcharts-xaxis-texts-g" transform="translate(0, -4)"></g>
                              </g>
                              <g id="SvgjsG1117" className="apexcharts-grid">
                              <g id="SvgjsG1118" className="apexcharts-gridlines-horizontal" style={{display: 'none'}}>
                              <line id="SvgjsLine1120" x1="0" y1="0" x2="347" y2="0" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1121" x1="0" y1="20" x2="347" y2="20" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1122" x1="0" y1="40" x2="347" y2="40" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1123" x1="0" y1="60" x2="347" y2="60" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1124" x1="0" y1="80" x2="347" y2="80" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1125" x1="0" y1="100" x2="347" y2="100" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1126" x1="0" y1="120" x2="347" y2="120" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1127" x1="0" y1="140" x2="347" y2="140" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1128" x1="0" y1="160" x2="347" y2="160" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1129" x1="0" y1="180" x2="347" y2="180" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line>
                              <line id="SvgjsLine1130" x1="0" y1="200" x2="347" y2="200" stroke="#ecf0f3" stroke-dasharray="4" className="apexcharts-gridline"></line></g>
                              <g id="SvgjsG1119" className="apexcharts-gridlines-vertical" style={{display: 'none'}}></g>
                              <line id="SvgjsLine1132" x1="0" y1="200" x2="347" y2="200" stroke="transparent" stroke-dasharray="0"></line>
                              <line id="SvgjsLine1131" x1="0" y1="1" x2="0" y2="200" stroke="transparent" stroke-dasharray="0"></line></g>
                              <g id="SvgjsG1095" className="apexcharts-bar-series apexcharts-plot-series"><g id="SvgjsG1096" className="apexcharts-series" rel="1" seriesName="NetxProfit" dataRealIndex="0">
                              <path id="SvgjsPath1098" d="M 17.349999999999998 200L 17.349999999999998 131.35892857142858Q 20.56785714285714 128.64107142857142 23.785714285714285 131.35892857142858L 23.785714285714285 131.35892857142858L 23.785714285714285 200L 23.785714285714285 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 17.349999999999998 200L 17.349999999999998 131.35892857142858Q 20.56785714285714 128.64107142857142 23.785714285714285 131.35892857142858L 23.785714285714285 131.35892857142858L 23.785714285714285 200L 23.785714285714285 200z" pathFrom="M 17.349999999999998 200L 17.349999999999998 200L 23.785714285714285 200L 23.785714285714285 200L 23.785714285714285 200L 17.349999999999998 200" cy="130" cx="66.42142857142856" j="0" val="35" barHeight="70" barWidth="7.435714285714286"></path>
                              <path id="SvgjsPath1099" d="M 66.92142857142856 200L 66.92142857142856 71.35892857142858Q 70.1392857142857 68.64107142857144 73.35714285714285 71.35892857142858L 73.35714285714285 71.35892857142858L 73.35714285714285 200L 73.35714285714285 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 66.92142857142856 200L 66.92142857142856 71.35892857142858Q 70.1392857142857 68.64107142857144 73.35714285714285 71.35892857142858L 73.35714285714285 71.35892857142858L 73.35714285714285 200L 73.35714285714285 200z" pathFrom="M 66.92142857142856 200L 66.92142857142856 200L 73.35714285714285 200L 73.35714285714285 200L 73.35714285714285 200L 66.92142857142856 200" cy="70" cx="115.99285714285713" j="1" val="65" barHeight="130" barWidth="7.435714285714286"></path>
                              <path id="SvgjsPath1100" d="M 116.49285714285713 200L 116.49285714285713 51.35892857142857Q 119.71071428571427 48.64107142857143 122.92857142857142 51.35892857142857L 122.92857142857142 51.35892857142857L 122.92857142857142 200L 122.92857142857142 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 116.49285714285713 200L 116.49285714285713 51.35892857142857Q 119.71071428571427 48.64107142857143 122.92857142857142 51.35892857142857L 122.92857142857142 51.35892857142857L 122.92857142857142 200L 122.92857142857142 200z" pathFrom="M 116.49285714285713 200L 116.49285714285713 200L 122.92857142857142 200L 122.92857142857142 200L 122.92857142857142 200L 116.49285714285713 200" cy="50" cx="165.5642857142857" j="2" val="75" barHeight="150" barWidth="7.435714285714286"></path>
                              <path id="SvgjsPath1101" d="M 166.0642857142857 200L 166.0642857142857 91.35892857142858Q 169.28214285714284 88.64107142857144 172.49999999999997 91.35892857142858L 172.49999999999997 91.35892857142858L 172.49999999999997 200L 172.49999999999997 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 166.0642857142857 200L 166.0642857142857 91.35892857142858Q 169.28214285714284 88.64107142857144 172.49999999999997 91.35892857142858L 172.49999999999997 91.35892857142858L 172.49999999999997 200L 172.49999999999997 200z" pathFrom="M 166.0642857142857 200L 166.0642857142857 200L 172.49999999999997 200L 172.49999999999997 200L 172.49999999999997 200L 166.0642857142857 200" cy="90" cx="215.13571428571424" j="3" val="55" barHeight="110" barWidth="7.435714285714286"></path>
                              <path id="SvgjsPath1102" d="M 215.63571428571424 200L 215.63571428571424 111.35892857142858Q 218.8535714285714 108.64107142857144 222.07142857142853 111.35892857142858L 222.07142857142853 111.35892857142858L 222.07142857142853 200L 222.07142857142853 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 215.63571428571424 200L 215.63571428571424 111.35892857142858Q 218.8535714285714 108.64107142857144 222.07142857142853 111.35892857142858L 222.07142857142853 111.35892857142858L 222.07142857142853 200L 222.07142857142853 200z" pathFrom="M 215.63571428571424 200L 215.63571428571424 200L 222.07142857142853 200L 222.07142857142853 200L 222.07142857142853 200L 215.63571428571424 200" cy="110" cx="264.7071428571428" j="4" val="45" barHeight="90" barWidth="7.435714285714286"></path>
                              <path id="SvgjsPath1103" d="M 265.2071428571428 200L 265.2071428571428 81.35892857142858Q 268.42499999999995 78.64107142857144 271.6428571428571 81.35892857142858L 271.6428571428571 81.35892857142858L 271.6428571428571 200L 271.6428571428571 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 265.2071428571428 200L 265.2071428571428 81.35892857142858Q 268.42499999999995 78.64107142857144 271.6428571428571 81.35892857142858L 271.6428571428571 81.35892857142858L 271.6428571428571 200L 271.6428571428571 200z" pathFrom="M 265.2071428571428 200L 265.2071428571428 200L 271.6428571428571 200L 271.6428571428571 200L 271.6428571428571 200L 265.2071428571428 200" cy="80" cx="314.27857142857135" j="5" val="60" barHeight="120" barWidth="7.435714285714286"></path>
                              <path id="SvgjsPath1104" d="M 314.77857142857135 200L 314.77857142857135 91.35892857142858Q 317.9964285714285 88.64107142857144 321.21428571428567 91.35892857142858L 321.21428571428567 91.35892857142858L 321.21428571428567 200L 321.21428571428567 200z" fill="rgba(255,255,255,0.25)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="0" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 314.77857142857135 200L 314.77857142857135 91.35892857142858Q 317.9964285714285 88.64107142857144 321.21428571428567 91.35892857142858L 321.21428571428567 91.35892857142858L 321.21428571428567 200L 321.21428571428567 200z" pathFrom="M 314.77857142857135 200L 314.77857142857135 200L 321.21428571428567 200L 321.21428571428567 200L 321.21428571428567 200L 314.77857142857135 200" cy="90" cx="363.8499999999999" j="6" val="55" barHeight="110" barWidth="7.435714285714286"></path>
                              </g>
                              <g id="SvgjsG1105" className="apexcharts-series" rel="2" seriesName="Revenue"   dataRealIndex="1">
                                <path id="SvgjsPath1107" d="M 24.785714285714285 200L 24.785714285714285 121.35892857142858Q 28.003571428571426 118.64107142857144 31.221428571428568 121.35892857142858L 31.221428571428568 121.35892857142858L 31.221428571428568 200L 31.221428571428568 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 24.785714285714285 200L 24.785714285714285 121.35892857142858Q 28.003571428571426 118.64107142857144 31.221428571428568 121.35892857142858L 31.221428571428568 121.35892857142858L 31.221428571428568 200L 31.221428571428568 200z" pathFrom="M 24.785714285714285 200L 24.785714285714285 200L 31.221428571428568 200L 31.221428571428568 200L 31.221428571428568 200L 24.785714285714285 200" cy="120" cx="73.85714285714285" j="0" val="40" barHeight="80" barWidth="7.435714285714286"></path>
                                <path id="SvgjsPath1108" d="M 74.35714285714285 200L 74.35714285714285 61.35892857142857Q 77.57499999999999 58.64107142857143 80.79285714285713 61.35892857142857L 80.79285714285713 61.35892857142857L 80.79285714285713 200L 80.79285714285713 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 74.35714285714285 200L 74.35714285714285 61.35892857142857Q 77.57499999999999 58.64107142857143 80.79285714285713 61.35892857142857L 80.79285714285713 61.35892857142857L 80.79285714285713 200L 80.79285714285713 200z" pathFrom="M 74.35714285714285 200L 74.35714285714285 200L 80.79285714285713 200L 80.79285714285713 200L 80.79285714285713 200L 74.35714285714285 200" cy="60" cx="123.42857142857142" j="1" val="70" barHeight="140" barWidth="7.435714285714286"></path>
                                <path id="SvgjsPath1109" d="M 123.92857142857142 200L 123.92857142857142 41.35892857142857Q 127.14642857142856 38.64107142857143 130.3642857142857 41.35892857142857L 130.3642857142857 41.35892857142857L 130.3642857142857 200L 130.3642857142857 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 123.92857142857142 200L 123.92857142857142 41.35892857142857Q 127.14642857142856 38.64107142857143 130.3642857142857 41.35892857142857L 130.3642857142857 41.35892857142857L 130.3642857142857 200L 130.3642857142857 200z" pathFrom="M 123.92857142857142 200L 123.92857142857142 200L 130.3642857142857 200L 130.3642857142857 200L 130.3642857142857 200L 123.92857142857142 200" cy="40" cx="172.99999999999997" j="2" val="80" barHeight="160" barWidth="7.435714285714286"></path>
                                <path id="SvgjsPath1110" d="M 173.49999999999997 200L 173.49999999999997 81.35892857142858Q 176.71785714285713 78.64107142857144 179.93571428571425 81.35892857142858L 179.93571428571425 81.35892857142858L 179.93571428571425 200L 179.93571428571425 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 173.49999999999997 200L 173.49999999999997 81.35892857142858Q 176.71785714285713 78.64107142857144 179.93571428571425 81.35892857142858L 179.93571428571425 81.35892857142858L 179.93571428571425 200L 179.93571428571425 200z" pathFrom="M 173.49999999999997 200L 173.49999999999997 200L 179.93571428571425 200L 179.93571428571425 200L 179.93571428571425 200L 173.49999999999997 200" cy="80" cx="222.57142857142853" j="3" val="60" barHeight="120" barWidth="7.435714285714286"></path>
                                <path id="SvgjsPath1111" d="M 223.07142857142853 200L 223.07142857142853 101.35892857142858Q 226.28928571428568 98.64107142857144 229.5071428571428 101.35892857142858L 229.5071428571428 101.35892857142858L 229.5071428571428 200L 229.5071428571428 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 223.07142857142853 200L 223.07142857142853 101.35892857142858Q 226.28928571428568 98.64107142857144 229.5071428571428 101.35892857142858L 229.5071428571428 101.35892857142858L 229.5071428571428 200L 229.5071428571428 200z" pathFrom="M 223.07142857142853 200L 223.07142857142853 200L 229.5071428571428 200L 229.5071428571428 200L 229.5071428571428 200L 223.07142857142853 200" cy="100" cx="272.1428571428571" j="4" val="50" barHeight="100" barWidth="7.435714285714286"></path>
                                <path id="SvgjsPath1112" d="M 272.6428571428571 200L 272.6428571428571 71.35892857142858Q 275.86071428571427 68.64107142857144 279.0785714285714 71.35892857142858L 279.0785714285714 71.35892857142858L 279.0785714285714 200L 279.0785714285714 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 272.6428571428571 200L 272.6428571428571 71.35892857142858Q 275.86071428571427 68.64107142857144 279.0785714285714 71.35892857142858L 279.0785714285714 71.35892857142858L 279.0785714285714 200L 279.0785714285714 200z" pathFrom="M 272.6428571428571 200L 272.6428571428571 200L 279.0785714285714 200L 279.0785714285714 200L 279.0785714285714 200L 272.6428571428571 200" cy="70" cx="321.71428571428567" j="5" val="65" barHeight="130" barWidth="7.435714285714286"></path>
                                <path id="SvgjsPath1113" d="M 322.21428571428567 200L 322.21428571428567 81.35892857142858Q 325.4321428571428 78.64107142857144 328.65 81.35892857142858L 328.65 81.35892857142858L 328.65 200L 328.65 200z" fill="rgba(255,255,255,1)" fill-opacity="1" stroke="transparent" stroke-opacity="1" stroke-linecap="square" stroke-width="1" stroke-dasharray="0" className="apexcharts-bar-area" index="1" clip-path="url(#gridRectMaskh2d0i4kc)" pathTo="M 322.21428571428567 200L 322.21428571428567 81.35892857142858Q 325.4321428571428 78.64107142857144 328.65 81.35892857142858L 328.65 81.35892857142858L 328.65 200L 328.65 200z" pathFrom="M 322.21428571428567 200L 322.21428571428567 200L 328.65 200L 328.65 200L 328.65 200L 322.21428571428567 200" cy="80" cx="371.2857142857142" j="6" val="60" barHeight="120" barWidth="7.435714285714286"></path><g id="SvgjsG1106" className="apexcharts-datalabels" dataRealIndex="1">
                                </g>
                                </g>
                              <g id="SvgjsG1097" className="apexcharts-datalabels" dataRealIndex="0"></g>
                              </g>
                              <line id="SvgjsLine1133" x1="0" y1="0" x2="347" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" className="apexcharts-ycrosshairs"></line>
                              <line id="SvgjsLine1134" x1="0" y1="0" x2="347" y2="0" stroke-dasharray="0" stroke-width="0" className="apexcharts-ycrosshairs-hidden"></line>
                              <g id="SvgjsG1135" className="apexcharts-yaxis-annotations"></g><g id="SvgjsG1136" className="apexcharts-xaxis-annotations"></g>
                              <g id="SvgjsG1137" className="apexcharts-point-annotations"></g></g><g id="SvgjsG1116" className="apexcharts-yaxis" rel="0" transform="translate(-18, 0)"></g>
                              <g id="SvgjsG1085" className="apexcharts-annotations"></g></svg>
                              <div className="apexcharts-legend"></div>
                              <div className="apexcharts-tooltip apexcharts-theme-light" style={{left: '96.6464px', top: '26px'}}>
                              <div className="apexcharts-tooltip-title" style={{fontFamily: 'Poppins', fontSize: '12px'}}>Mar</div>
                              <div className="apexcharts-tooltip-series-group apexcharts-active" style={{ display: 'flex'}}>
                              <span className="apexcharts-tooltip-marker" style={{backgroundColor: 'rgb(255, 255, 255)', display: 'none' }}></span>
                              <div className="apexcharts-tooltip-text" style={{fontFamily: 'Poppins', fontSize: '12px'}}>
                              <div className="apexcharts-tooltip-y-group">
                              <span className="apexcharts-tooltip-text-label">Revenue: </span>
                              <span className="apexcharts-tooltip-text-value">$70 thousands</span></div><div className="apexcharts-tooltip-z-group">
                              <span className="apexcharts-tooltip-text-z-label"></span><span className="apexcharts-tooltip-text-z-value"></span>
                              </div>
                              </div>
                              </div>
                              <div className="apexcharts-tooltip-series-group" style={{display: 'none'}}>
                              <span className="apexcharts-tooltip-marker" style={{backgroundColor: 'rgb(255, 255, 255)', display: 'none'}}></span>
                              <div className="apexcharts-tooltip-text" style={{fontFamily: 'Poppins', fontSize: '12px'}}>
                              <div className="apexcharts-tooltip-y-group">
                              <span className="apexcharts-tooltip-text-label">Revenue: </span><span className="apexcharts-tooltip-text-value">$70 thousands</span>
                              </div>
                              <div className="apexcharts-tooltip-z-group">
                              <span className="apexcharts-tooltip-text-z-label"></span>
                              <span className="apexcharts-tooltip-text-z-value"></span>
                              </div>
                              </div></div></div>
                              <div className="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-light"><div className="apexcharts-yaxistooltip-text"></div></div></div></div>

                        
                        <div className="card-spacer bg-white card-rounded flex-grow-1">

                          <div className="row m-0">
                          <div className="col px-8 py-6 mr-8">
                            <div className="font-size-sm text-muted font-weight-bold">Revenue</div>
                            <div className="font-size-h4 font-weight-bolder">$606,050</div>
                          </div>
                          <div className="col px-8 py-6">
                            <div className="font-size-sm text-muted font-weight-bold">Commission</div>
                            <div className="font-size-h4 font-weight-bolder">$60,600</div>
                          </div>
                        </div>

                          
                          <div className="row m-0">
                          <div className="col px-8 py-6 mr-8">
                            <div className="font-size-sm text-muted font-weight-bold">Order Total</div>
                            <div className="font-size-h4 font-weight-bolder">$29,004</div>
                          </div>
                          <div className="col px-8 py-6">
                            <div className="font-size-sm text-muted font-weight-bold">Aggret. Total</div>
                            <div className="font-size-h4 font-weight-bolder">$1,480,00</div>
                          </div>
                        </div>

                          
                          <div className="row m-0">
                          <div className="col px-8 py-6 mr-8">
                            <div className="font-size-sm text-muted font-weight-bold">New Customer</div>
                            <div className="font-size-h4 font-weight-bolder">100</div>
                          </div>

                        </div>

                        </div>

                      <div className="resize-triggers"><div className="expand-trigger"><div style={{width: '388px', height: '514px'}}></div></div><div className="contract-trigger"></div></div></div>

                    </div>

                  </div>
                <div className="col-xl-8">
                  <div className="row">
                    <div className="col-xl-12">

                          <div className="card card-custom gutter-b card-stretch">

                            <div className="card-header border-0">
                          <h3 className="card-title font-weight-bolder text-dark">League Overview</h3>
                        </div>

                            
                            <div className="card-body pt-0">

                              <div className="d-flex align-items-center flex-wrap mb-5 ">

                                <div className="symbol symbol-25 symbol-light mr-5">
                              <span className="symbol-label">
                                <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">Tennis</a>
                              </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                            </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                <span className="symbol-label">
                                  <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                  <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">NHL</a>
                                </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                              </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                  <span className="symbol-label">
                                    <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                    <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                  </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                    <span className="symbol-label">
                                      <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                    </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                  </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                      <span className="symbol-label">
                                        <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                        <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                      </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                    </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                        <span className="symbol-label">
                                          <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                          <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                        </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                      </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                          <span className="symbol-label">
                                            <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                          </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                        </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                            <span className="symbol-label">
                                              <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                              <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                            </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                          </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                              <span className="symbol-label">
                                                <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                                <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                              </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                            </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                                <span className="symbol-label">
                                                  <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                                  <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                                </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                              </div>

                              
                              <div className="d-flex align-items-center flex-wrap mb-5">

                                <div className="symbol symbol-25 symbol-light mr-5">
                                                  <span className="symbol-label">
                                                    <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                                  </span>
                                </div>

                                
                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                                    <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-3g mb-1">UFC</a>
                                                  </div>

                                <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$16,888</span>
                                                </div>

                            </div>


                          </div>

                        </div>
                                        </div>
                                      </div>
                                    </div>

                
                <div className="row">
                                      <div className="col-xl-12">

                    <div className="card card-custom gutter-b card-stretch">

                      <div className="card-header border-0 pt-5">
                                            <h3 className="card-title align-items-start flex-column">
                                              <span className="card-label font-weight-bolder text-dark">Events <small><a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html">view all</a></small></span><a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html">
                                              </a></h3><a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html">
                                            </a><div className="card-toolbar"><a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html">
                                            </a><ul className="nav nav-pills nav-pills-sm nav-dark-75"><a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html">
                                            </a><li className="nav-item"><a href="https://urbanmerchantdesign.com/ppw/admin/dist/events.html">
                                            </a><a className="nav-link py-2 px-4 active" data-toggle="tab" href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#kt_tab_pane_4_1">Today</a>
                                                </li>
                                                <li className="nav-item">
                                                  <a className="nav-link py-2 px-4" data-toggle="tab" href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#kt_tab_pane_4_2">Yesterday</a>
                                                </li>
                                                <li className="nav-item">
                                                  <a className="nav-link py-2 px-4" data-toggle="tab" href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#kt_tab_pane_4_3">Past</a>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>

                      
                      <div className="card-body pt-2 pb-0">

                        <div className="table-responsive">
                                              <table className="table table-borderless table-vertical-center">
                                                <thead>
                                                  <tr>
                                                    <th className="p-0" style={{ width: '75px'}}></th>
                                                    <th className="p-0" style={{minWidth: '200px'}}></th>
                                                    <th className="p-0" style={{minWidth: '140px'}}>Total</th>
                                                    <th className="p-0" style={{minWidth: '140px'}}>Matched</th>
                                                    <th className="p-0" style={{minWidth: '50'}}>%</th>
                                                    <th className="p-0" style={{minWidth: '110px'}}></th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr>
                                                    <td className="py-5 pl-0">
                                                      <span>
                                                        NHL
                                    </span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">Vancouver Canucks vs Calgary Flames</a>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$59,559</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$41,999</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">91%</span>
                                                    </td>
                                                    <td className="text-right">
                                                      <span className="label label-lg label-light-primary label-inline">Upcoming</span>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="py-5 pl-0">
                                                      <span>
                                                        NHL
                                    </span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">Vancouver Canucks vs Calgary Flames</a>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$59,559</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$41,999</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">91%</span>
                                                    </td>
                                                    <td className="text-right">
                                                      <span className="label label-lg label-light-warning label-inline">In Progress</span>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="py-5 pl-0">
                                                      <span>
                                                        NHL
                                    </span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">Vancouver Canucks vs Calgary Flames</a>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$59,559</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$41,999</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">91%</span>
                                                    </td>
                                                    <td className="text-right">
                                                      <span className="label label-lg label-light-success label-inline">Completed</span>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="py-5 pl-0">
                                                      <span>
                                                        NHL
                                    </span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="text-dark font-weight-bolder text-hover-primary mb-1 font-size-lg">Vancouver Canucks vs Calgary Flames</a>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$59,559</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">$41,999</span>
                                                    </td>
                                                    <td className="pl-0">
                                                      <span className="text-muted font-weight-500">91%</span>
                                                    </td>
                                                    <td className="text-right">
                                                      <span className="label label-lg label-light-danger label-inline">Cancelled</span>
                                                    </td>
                                                  </tr>

                                                </tbody>
                                              </table>
                                            </div>

                      </div>

                    </div>

                  </div>
                                    </div>

                
                <div className="row">
                                      <div className="col-lg-4">

                    <div className="card card-custom card-stretch gutter-b">

                      <div className="card-header border-0 pt-5">
                                            <h3 className="card-title font-weight-bolder">Successful Matches</h3>
                                          </div>

                      
                      <div className="card-body d-flex flex-column">
                                            <div className="flex-grow-1" style={{position: 'relative'}}>
                                              <div id="kt_mixed_widget_14_chart" style={{ height: '200px', minHeight: '200.7px'}}>
                                                <div id="apexcharts494bfylcg" className="apexcharts-canvas apexcharts494bfylcg apexcharts-theme-light" style={{ width: '328px', height: '200.7px'}}>
                                                  <svg id="SvgjsSvg1138" width="328" height="200.7" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSvgjs="http://svgjs.com/svgjs" className="apexcharts-svg" xmlnsData="ApexChartsNS" transform="translate(0, 0)" style={{ background: 'transparent' }}>
                                                    <g id="SvgjsG1140" className="apexcharts-inner apexcharts-graphical" transform="translate(77, 0)">
                                                      <defs id="SvgjsDefs1139">
                                                        <clippath id="gridRectMask494bfylcg">
                                                          <rect id="SvgjsRect1142" width="182" height="200" x="-3" y="-1" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff">
                                                          </rect>
                                                        </clippath>
                                                        <clippath id="gridRectMarkerMask494bfylcg">
                                                          <rect id="SvgjsRect1143" width="180" height="202" x="-2" y="-2" rx="0" ry="0" opacity="1" stroke-width="0" stroke="none" stroke-dasharray="0" fill="#fff">
                                                          </rect>
                                                        </clippath>
                                                      </defs>
                                                    <g id="SvgjsG1145" className="apexcharts-radialbar">
                                                    <g id="SvgjsG1146">
                                                    <g id="SvgjsG1147" className="apexcharts-tracks">
                                                      <g id="SvgjsG1148" className="apexcharts-radialbar-track apexcharts-track" rel="1">
                                                        <path id="apexcharts-radialbarTrack-0" d="M 88 29.693292682926824 A 69.30670731707318 69.30670731707318 0 1 1 87.9879036976974 29.69329373852834" fill="none" fill-opacity="1" stroke="rgba(201,247,245,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="10.852439024390247" stroke-dasharray="0" className="apexcharts-radialbar-area" dataPathOrig="M 88 29.693292682926824 A 69.30670731707318 69.30670731707318 0 1 1 87.9879036976974 29.69329373852834">
                                                        </path>
                                                      </g>
                                                    </g>
                                                    <g id="SvgjsG1150">
                                                      <g id="SvgjsG1154" className="apexcharts-series apexcharts-radial-series" seriesName="Progress" rel="1" dataRealIndex="0"><path id="SvgjsPath1155" d="M 88 29.693292682926824 A 69.30670731707318 69.30670731707318 0 1 1 18.862120338608293 103.8345915092552" fill="none" fill-opacity="0.85" stroke="rgba(27,197,189,0.85)" stroke-opacity="1" stroke-linecap="round" stroke-width="10.852439024390247" stroke-dasharray="0" className="apexcharts-radialbar-area apexcharts-radialbar-slice-0" dataAngle="266" dataValue="74" index="0" j="0" dataPathOrig="M 88 29.693292682926824 A 69.30670731707318 69.30670731707318 0 1 1 18.862120338608293 103.8345915092552">
                                                      </path>
                                                      </g>
                                                      <circle id="SvgjsCircle1151" r="63.88048780487805" cx="88" cy="99" className="apexcharts-radialbar-hollow" fill="transparent">
                                                      </circle>
                                                      <g id="SvgjsG1152" className="apexcharts-datalabels-group" transform="translate(0, 0) scale(1)" style={{ opacity: 1 }}>
                                                      <text id="SvgjsText1153" font-family="Helvetica, Arial, sans-serif" x="88" y="111" text-anchor="middle" dominant-baseline="auto" font-size="30px" font-weight="700" fill="#464e5f" className="apexcharts-text apexcharts-datalabel-value" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>74%</text>
                                                      </g>
                                                      </g>
                                                      </g>
                                                      </g>
                                                      <line id="SvgjsLine1156" x1="0" y1="0" x2="176" y2="0" stroke="#b6b6b6" stroke-dasharray="0" stroke-width="1" className="apexcharts-ycrosshairs"></line>
                                                      <line id="SvgjsLine1157" x1="0" y1="0" x2="176" y2="0" stroke-dasharray="0" stroke-width="0" className="apexcharts-ycrosshairs-hidden"></line>
                                                      </g>
                                                      <g id="SvgjsG1141" className="apexcharts-annotations"></g>
                                                  </svg>
                                                  <div className="apexcharts-legend"></div>
                                                </div>
                                              </div>
                                      <div className="resize-triggers"><div className="expand-trigger"><div style={{width: '329px', height: '212px'}}></div></div><div className="contract-trigger"></div></div></div>
                                    <div className="pt-10">
                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="btn btn-success btn-shadow-hover font-weight-bolder w-100 py-3">Details</a>
                                    </div>
                                  </div>

                    </div>

                  </div>
                              <div className="col-xl-4">

                    <div className="card card-custom gutter-b card-stretch">

                      <div className="card-header border-0">
                                    <h3 className="card-title font-weight-bolder text-dark">Recent Deposits</h3>
                                  </div>

                      
                      <div className="card-body pt-0">

                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                        <span className="symbol-label">
                                          <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                          <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                        </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                      </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                          <span className="symbol-label">
                                            <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                          </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                        </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                            <span className="symbol-label">
                                              <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                              <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                            </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                          </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                              <span className="symbol-label">
                                                <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                              </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                            </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                <span className="symbol-label">
                                                  <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                  <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                              </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                  <span className="symbol-label">
                                                    <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                    <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                  </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                    <span className="symbol-label">
                                                      <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                      <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                    </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                  </div>

                      </div>

                    </div>

                  </div>
                                            <div className="col-xl-4">

                    <div className="card card-custom gutter-b card-stretch">

                      <div className="card-header border-0">
                                                  <h3 className="card-title font-weight-bolder text-dark">Recent Withdrawals</h3>
                                                </div>

                      
                      <div className="card-body pt-0">

                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                      <span className="symbol-label">
                                                        <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                        <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                      </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                    </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                        <span className="symbol-label">
                                                          <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                          <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                        </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                      </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                          <span className="symbol-label">
                                                            <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                            <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                          </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                        </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                            <span className="symbol-label">
                                                              <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                              <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                            </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                          </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                              <span className="symbol-label">
                                                                <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                                <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                              </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                            </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                                <span className="symbol-label">
                                                                  <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                                  <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                                </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                              </div>

                        
                        <div className="d-flex align-items-center flex-wrap mb-5">

                          <div className="symbol symbol-25 symbol-light mr-5">
                                                                  <span className="symbol-label">
                                                                    <img src="./images/006-plurk.svg" className="h-50 align-self-center" alt="" />
                            </span>
                          </div>

                          
                          <div className="d-flex flex-column flex-grow-1 mr-2">
                                                                    <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1">James Bond</a>
                                                                  </div>

                          <span className="label label-xl label-light label-inline my-lg-0 my-2 text-dark-50 font-weight-bolder">$100</span>
                                                                </div>

                      </div>

                    </div>

                  </div>
                                                        </div>

                
              </div>

            </div>

          </div>

          
          <div className="footer py-4 d-flex flex-lg-column" id="kt_footer">

            <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">

              <div className="text-dark order-2 order-md-1">
                                                        <span className="text-muted font-weight-bold mr-2">2020©</span>
                                                        <a href="https://urbanmerchantdesign.com/ppw/admin/dist/index.html#" target="_blank" className="text-white text-hover-primary">PayPerWin</a>
                                                      </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    
    <div id="kt_scrolltop" className="scrolltop">
                                              <span className="svg-icon">

        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                  <polygon points="0 0 24 0 24 24 0 24"></polygon>
                                                  <rect fill="#000000" opacity="0.3" x="11" y="10" width="2" height="10" rx="1"></rect>
                                                  <path d="M6.70710678,12.7071068 C6.31658249,13.0976311 5.68341751,13.0976311 5.29289322,12.7071068 C4.90236893,12.3165825 4.90236893,11.6834175 5.29289322,11.2928932 L11.2928932,5.29289322 C11.6714722,4.91431428 12.2810586,4.90106866 12.6757246,5.26284586 L18.6757246,10.7628459 C19.0828436,11.1360383 19.1103465,11.7686056 18.7371541,12.1757246 C18.3639617,12.5828436 17.7313944,12.6103465 17.3242754,12.2371541 L12.0300757,7.38413782 L6.70710678,12.7071068 Z" fill="#000000" fill-rule="nonzero"></path>
                                                </g>
        </svg>

      </span>
                                          </div>

  
<svg id="SvgjsSvg1001" width="2" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsSvgjs="http://svgjs.com/svgjs" style={{overflow: 'hidden', top: '-100%', left: '-100%', position: 'absolute', opacity: 0 }}><defs id="SvgjsDefs1002"></defs><polyline id="SvgjsPolyline1003" points="0,0"></polyline><path id="SvgjsPath1004" d="M0 0 "></path></svg>
        <div className="daterangepicker ltr show-ranges opensleft" style={{ display: 'none' }}><div className="ranges"><ul><li data-range-key="Today">Today</li><li data-range-key="Yesterday">Yesterday</li><li data-range-key="Last 7 Days">Last 7 Days</li><li data-range-key="Last 30 Days">Last 30 Days</li><li data-range-key="This Month">This Month</li><li data-range-key="Last Month">Last Month</li><li data-range-key="Custom Range">Custom Range</li></ul></div><div className="drp-calendar left"><div className="calendar-table"></div><div className="calendar-time" style={{display: 'none'}}></div></div><div className="drp-calendar right"><div className="calendar-table"></div><div className="calendar-time" style={{display: 'none'}}></div></div><div className="drp-buttons"><span className="drp-selected"></span><button className="cancelBtn btn btn-sm btn-light-primary" type="button">Cancel</button><button className="applyBtn btn btn-sm btn-primary" disabled="disabled" type="button">Apply</button> </div></div>
      </div>
    );
  }
}

export default withRouter(App);