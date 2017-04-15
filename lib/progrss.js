/*jshint  esnext: true, node: true, jquery: true, devel: true */

/**
 *    Copyright 2017 Joris PROT <jp@cdswebbuilder.eu>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var progrSs = {};

//create progressBar and append it to header
progrSs.pos = () => {
	progrSs.rm();
	$(`	<svg id="prgrs-svg" viewBox="0 0 100 1"version="1.1" xmlns="http://www.w3.org/2000/svg">
			<line id="prgrs-line" x1="0" y1="1" x2="0" y2="1" stroke-width="1" stroke="blue"><line/>
		</svg>`).appendTo('header');
	
};

//start function
progrSs.strt = () => {
	progrSs.pos();
	$('#prgrs-line').html(`<animate id="prgrs-line-anim" attributeType="XML" attributeName="x2" from="0" to="100"
        dur="95s"/>`);
};

//stop function
progrSs.good = (cb) => {

	//sets the acceleration of the line
	$('#prgrs-line-anim').attr({
		dur:'3s',
		keySplines:'1.9, 0.30, 0.24, 1.01'
	});
	cb();
};

//remove bar
progrSs.rm = () => {
	$('#prgrs-svg').remove();
};