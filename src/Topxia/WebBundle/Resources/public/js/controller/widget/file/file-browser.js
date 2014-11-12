define(function(require, exports, module) {

    var Widget = require('widget');

    var FileBrowser = Widget.extend({
        attrs: {
            url: null,
            baseUrl: null,
            mySharingContactsUrl: null,
            files: []
        },
        _inited: false,

        events: {
            'click .file-browser-item': 'onSelectFile',
            'input .file-filter-by-name': 'onFilterByName',
            'change input:radio': 'onFilterBySource',
            'change .file-filter-by-owner' : 'onFilterByOwner'
        },

        setup: function() {
            this._readAttrFromData();
            this._insertFilter();
        },

        show: function() {

            if (this._inited) {
                return ;
            }
            _inited = true;

            if (!this.element.hasClass('file-browser')) {
                this.element.addClass('file-browser');
            }

            var self = this;

            $.get(this.get('url'), function(files) {
        	    self.refreshFileList(self, files);
            }, 'json');

            return this;
        },
        
        refreshFileList: function(self, files){
        	if (files.length > 0) {
                        var html = '<ul class="file-browser-list">';
                        $.each(files, function(i, file){
                            html += '<li class="file-browser-item clearfix" data-index="' + i + '">';
                            html += '<span class="filename">' + file.filename + '</span>';
                            html += '<span class="filesize">' + file.size + '</span>';
                            html += '<span class="filetime">' + file.updatedTime + '</span>';
                            html += '<span class="createdUserId" style="display: none;">' + file.createdUserId + '</span>';
                            html += '</li>';
                        });
                        html += '</ul>';
                        $(".file-browser-list-container", self.element).html(html);
//                        self.element.html(html);
                        self.set('files', files);
                    } else {
                        var message = self.element.data('empty');
                        if (message) {
//                            self.element.html('<div class="empty">' + message + '</div>');
                    	    $(".file-browser-list-container", self.element).html('<div class="empty">' + message + '</div>');
                        }
                    }
        },

        onSelectFile: function(e) {
            var $file = $(e.currentTarget);
            var file = this.get('files')[$file.data('index')];
            this.trigger('select', file);
        },
        
        onFilterByOwner: function(e){
        	$userId = $(".file-filter-by-owner", this.element).val();
        	$(".file-filter-by-name", this.element).val("");
        	
			$("li.file-browser-item").each(function( index ) {
				//Show the file entry when the owner id equals to selected user id.
				if(!$userId || $( "span.createdUserId", this ).text() == $userId){
					$( this ).show();
				}else{
					$( this ).hide();
				}
			});
        	
        },
        
        onFilterByName: function(e){
        	$key = $(".file-filter-by-name", this.element).val();
        	
			$("li.file-browser-item").each(function( index ) {
				//Show the file entry when the keyword is empty or it's matching.
				if(!$key || $( "span.filename", this ).text().indexOf($key) >= 0){
					$( this ).show();
				}else{
					$( this ).hide();
				}
			});
        	
        },
        
        onFilterBySource: function(e){
        	$source = $("input:radio[name="+this.element.attr("id")+"-source]:checked", this.element).val();
        	$(".file-filter-by-name", this.element).val("");
        	
        	if($source == "shared"){
        		$(".file-filter-by-owner-container", this.element).show();
        	}else{
        		$(".file-filter-by-owner-container", this.element).hide();
        	}
        	
        	var self = this;
        	
        	$.get(self.get('baseUrl'), {source: $source}, function(files) {
            	    self.refreshFileList(self, files);
                }, 'json');
        },

        _readAttrFromData: function() {
            if (!this.get('url')) {
                this.set('url', this.element.data('default-url'));
            }
            if (!this.get('baseUrl')) {
                    this.set('baseUrl', this.element.data('base-url'));
                }
            
            if (!this.get('mySharingContacts')) {
                    this.set('mySharingContacts', this.element.data('my-sharing-contacts-url'));
                }
        },
        
        _insertFilter: function(){
        	$filterHtml = 
        	"<div class='file-browser-filter'> \
				<div class='radios'>资料来源： \
        			<label><input type='radio' name='"+this.element.attr("id")+"-source' value='upload' checked>来自上传</label> \
        			<label><input type='radio' name='"+this.element.attr("id")+"-source' value='shared'>来自分享</label> \
		      </div> \
		      <div class='file-filter-by-owner-container' style='display: none;'> \
		      	<select required='required' class='file-filter-by-owner form-control width-input'> \
			    		<option value=''>请选择老师</option> \
			    </select> \
		      </div> \
		      <div class='input-group'> \
			    <input class='form-control width-input-small file-filter-by-name' type='text' placeholder='输入视频标题关键字'  /> \
			    <span class='input-group-btn'> \
			      <button type='button' class='btn btn-default' data-loading-text='正在搜索，请稍等'>搜索</button> \
			    </span> \
			  </div> \
			</div> ";
		
        	this.element.prepend($filterHtml);
        }
    });

    module.exports = FileBrowser;
});