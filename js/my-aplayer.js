(function() {
		const app = new APlayer({
		container: document.getElementById('aplayer'),
		audio: [{
    name: 'Enchanted',            <!-- 歌曲名称-->
    artist: 'Taylor Swift',          <!-- 歌曲作者-->
    url: 'music/Enchanted.mp3',      <!-- 歌曲路径-->
    cover: 'music/Enchanted.jpg',  <!-- 歌曲封面图片-->
    autoplay: true,     // （可选) 自动播放，移动端浏览器暂时不支持此功能
    theme: '#46718b',           <!-- 选中歌曲的主题-->
			}]
		});

	var aplayer_img = document.getElementsByClassName('aplayer-img')[0];
	app.on('play',function() {
		aplayer_img.style.animationPlayState = 'running';
		console.log('player play');
	});

	app.on('pause',function() {
		aplayer_img.style.animationPlayState = 'paused';
		console.log('player ended');
	});

}())