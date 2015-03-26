<% if $Images %>
	<div class="fotorama" data-nav="false">
	<% loop Images %>
		<% include ImageField %>
	<% end_loop %>
	</div>
<% end_if %>
